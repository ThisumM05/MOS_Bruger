import math
import re
from collections import Counter, defaultdict

from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Menu, Category, Promotion
from .serializers import (MenuSerializer, 
                          CategorySerializer, 
                          MenuCreateUpdateSerializer,
                          MenuDetailSerializer)
from orders.models import OrderItem


def _tokenize_text(text):
    if not text:
        return []
    return re.findall(r"[a-zA-Z0-9]+", text.lower())


def _cosine_similarity(lhs_map, rhs_map):
    if not lhs_map or not rhs_map:
        return 0.0

    shared_keys = set(lhs_map.keys()) & set(rhs_map.keys())
    if not shared_keys:
        return 0.0

    dot = sum(float(lhs_map[k]) * float(rhs_map[k]) for k in shared_keys)
    lhs_norm = math.sqrt(sum(float(v) ** 2 for v in lhs_map.values()))
    rhs_norm = math.sqrt(sum(float(v) ** 2 for v in rhs_map.values()))

    if lhs_norm == 0 or rhs_norm == 0:
        return 0.0

    return dot / (lhs_norm * rhs_norm)


def _menu_payload(menu_item):
    return {
        'id': menu_item.id,
        'name': menu_item.name,
        'description': menu_item.description,
        'base_price': menu_item.base_price,
        'category': menu_item.category_id,
        'category_name': menu_item.category.name if menu_item.category else None,
    }

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CategorySerializer
        return CategorySerializer


class MenuViewSet(ModelViewSet):
    queryset = Menu.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MenuDetailSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return MenuCreateUpdateSerializer
        return MenuSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def recommendations(self, request):
        user = request.user
        limit = request.query_params.get('limit', '8')

        try:
            limit = max(1, min(20, int(limit)))
        except ValueError:
            limit = 8

        available_items = list(
            Menu.objects.select_related('category').filter(is_available=True)
        )
        if not available_items:
            return Response([])

        # Build user-item interactions from historical orders.
        order_items = OrderItem.objects.select_related('menu', 'order__customer').exclude(
            order__status='CANCELLED'
        )
        user_vectors = defaultdict(lambda: defaultdict(float))
        item_popularity = Counter()

        for order_item in order_items:
            uid = order_item.order.customer_id
            mid = order_item.menu_id
            qty = float(order_item.quantity)
            user_vectors[uid][mid] += qty
            item_popularity[mid] += int(order_item.quantity)

        current_vector = user_vectors.get(user.id, {})
        ordered_menu_ids = set(current_vector.keys())

        # Collaborative score: weighted by user similarity.
        collaborative_scores = defaultdict(float)
        if current_vector:
            for other_user_id, other_vector in user_vectors.items():
                if other_user_id == user.id:
                    continue
                similarity = _cosine_similarity(current_vector, other_vector)
                if similarity <= 0:
                    continue
                for menu_id, qty in other_vector.items():
                    if menu_id in ordered_menu_ids:
                        continue
                    collaborative_scores[menu_id] += similarity * float(qty)

        max_collab = max(collaborative_scores.values(), default=0.0)

        # Content score: compare menu text to user's historical preference profile.
        profile_tokens = Counter()
        preferred_categories = Counter()

        if ordered_menu_ids:
            previous_menus = Menu.objects.select_related('category').filter(id__in=ordered_menu_ids)
            for previous_menu in previous_menus:
                for token in _tokenize_text(f"{previous_menu.name} {previous_menu.description}"):
                    profile_tokens[token] += 1
                if previous_menu.category_id:
                    preferred_categories[previous_menu.category_id] += 1

        recommendations = []
        for menu_item in available_items:
            if menu_item.id in ordered_menu_ids:
                continue

            collab_norm = 0.0
            if max_collab > 0 and collaborative_scores.get(menu_item.id):
                collab_norm = collaborative_scores[menu_item.id] / max_collab

            content_norm = 0.0
            if profile_tokens:
                item_tokens = _tokenize_text(f"{menu_item.name} {menu_item.description}")
                if item_tokens:
                    overlap_weight = sum(profile_tokens.get(token, 0) for token in item_tokens)
                    category_boost = 0.0
                    if menu_item.category_id and preferred_categories:
                        max_category_pref = max(preferred_categories.values())
                        if max_category_pref > 0:
                            category_boost = preferred_categories.get(menu_item.category_id, 0) / max_category_pref
                    content_norm = min(1.0, (overlap_weight / 10.0) + (0.35 * category_boost))

            # Fallback popularity allows recommendations even with sparse history.
            popularity = item_popularity.get(menu_item.id, 0)
            max_popularity = max(item_popularity.values(), default=0)
            popularity_norm = (popularity / max_popularity) if max_popularity > 0 else 0.0

            if current_vector:
                final_score = 0.6 * collab_norm + 0.3 * content_norm + 0.1 * popularity_norm
            else:
                final_score = popularity_norm

            if final_score <= 0:
                continue

            reason = 'Popular choice right now'
            if collab_norm >= max(content_norm, popularity_norm):
                reason = 'Customers with similar taste loved this'
            elif content_norm >= max(collab_norm, popularity_norm):
                reason = 'Matches your previous order preferences'

            recommendations.append({
                'id': menu_item.id,
                'name': menu_item.name,
                'description': menu_item.description,
                'base_price': menu_item.base_price,
                'is_available': menu_item.is_available,
                'category': menu_item.category_id,
                'score': round(float(final_score), 4),
                'reason': reason,
            })

        if not recommendations:
            popular_menu_ids = [
                menu_id for menu_id, _ in item_popularity.most_common(limit)
            ]
            popular_items_map = {
                item.id: item
                for item in Menu.objects.filter(id__in=popular_menu_ids, is_available=True)
            }
            recommendations = []
            for menu_id in popular_menu_ids:
                item = popular_items_map.get(menu_id)
                if not item:
                    continue
                recommendations.append({
                    'id': item.id,
                    'name': item.name,
                    'description': item.description,
                    'base_price': item.base_price,
                    'is_available': item.is_available,
                    'category': item.category_id,
                    'score': 1.0,
                    'reason': 'Popular choice right now',
                })

        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return Response(recommendations[:limit])

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def chatbot(self, request):
        message = (request.data.get('message') or '').strip()
        if not message:
            return Response({
                'reply': 'Please type a message. You can ask for offers, menu suggestions, or say: add spicy burger.',
                'suggestions': [],
                'action': None,
            })

        lower_message = message.lower()
        available_items = list(Menu.objects.select_related('category').filter(is_available=True))

        def find_keyword_matches(keywords):
            matches = []
            for menu_item in available_items:
                hay = f"{menu_item.name} {menu_item.description} {menu_item.category.name if menu_item.category else ''}".lower()
                if any(k in hay for k in keywords):
                    matches.append(menu_item)
            return matches[:5]

        if any(greet in lower_message for greet in ['hi', 'hello', 'hey']):
            return Response({
                'reply': 'Hi! I can help you find menu items, show active offers, and add items to your cart by text.',
                'suggestions': [],
                'action': None,
            })

        if any(word in lower_message for word in ['offer', 'promo', 'discount', 'deal']):
            promos = list(Promotion.objects.filter(is_active=True)[:3])
            if not promos:
                return Response({
                    'reply': 'There are no active offers right now, but I can still help you pick a great meal.',
                    'suggestions': [],
                    'action': None,
                })

            offer_lines = []
            for promo in promos:
                if promo.promo_code:
                    offer_lines.append(f"{promo.title} ({promo.promo_code})")
                else:
                    offer_lines.append(promo.title)

            return Response({
                'reply': 'Current offers: ' + '; '.join(offer_lines),
                'suggestions': [],
                'action': None,
            })

        if any(word in lower_message for word in ['recommend', 'suggest', 'popular', 'best seller']):
            popularity = Counter()
            for order_item in OrderItem.objects.select_related('menu').exclude(order__status='CANCELLED'):
                popularity[order_item.menu_id] += int(order_item.quantity)

            ranked_ids = [menu_id for menu_id, _ in popularity.most_common(5)]
            ranked_map = {item.id: item for item in available_items if item.id in ranked_ids}
            picks = [ranked_map[mid] for mid in ranked_ids if mid in ranked_map]

            if not picks:
                picks = available_items[:5]

            return Response({
                'reply': 'Here are some popular picks you might like.',
                'suggestions': [_menu_payload(item) for item in picks],
                'action': None,
            })

        if 'add' in lower_message and ('cart' in lower_message or len(lower_message.split()) >= 2):
            add_target = re.sub(r'^\s*add\s+', '', lower_message)
            add_target = add_target.replace('to cart', '').strip()

            best_match = None
            best_score = -1
            for menu_item in available_items:
                searchable = f"{menu_item.name} {menu_item.description}".lower()
                if add_target and add_target in searchable:
                    score = len(add_target)
                else:
                    # token overlap fallback
                    query_tokens = set(_tokenize_text(add_target))
                    item_tokens = set(_tokenize_text(searchable))
                    score = len(query_tokens & item_tokens)

                if score > best_score:
                    best_score = score
                    best_match = menu_item

            if best_match and best_score > 0:
                payload = _menu_payload(best_match)
                return Response({
                    'reply': f"Added {best_match.name} to your cart.",
                    'suggestions': [payload],
                    'action': {
                        'type': 'add_to_cart',
                        'item': payload,
                    },
                })

            return Response({
                'reply': 'I could not find that exact item. Try saying: add chicken burger to cart.',
                'suggestions': [_menu_payload(item) for item in available_items[:5]],
                'action': None,
            })

        if any(word in lower_message for word in ['spicy', 'chicken', 'beef', 'veggie', 'dessert', 'drink']):
            keyword_map = {
                'spicy': ['spicy', 'jalapeno', 'hot'],
                'chicken': ['chicken'],
                'beef': ['beef'],
                'veggie': ['veggie', 'vegetable', 'veg'],
                'dessert': ['dessert', 'sweet', 'ice cream', 'cake'],
                'drink': ['drink', 'beverage', 'juice', 'coffee', 'tea'],
            }

            selected_keywords = []
            for intent_keyword, mapped_keywords in keyword_map.items():
                if intent_keyword in lower_message:
                    selected_keywords.extend(mapped_keywords)

            picks = find_keyword_matches(selected_keywords)
            if picks:
                return Response({
                    'reply': 'Great choice. These items match what you asked for.',
                    'suggestions': [_menu_payload(item) for item in picks],
                    'action': None,
                })

        return Response({
            'reply': 'I can help with menu search, offers, and quick cart actions. Try: "show spicy burgers", "any offers?", or "add chicken burger to cart".',
            'suggestions': [_menu_payload(item) for item in available_items[:4]],
            'action': None,
        })


from .serializers import PromotionSerializer

class PromotionViewSet(ModelViewSet):
    queryset = Promotion.objects.filter(is_active=True)
    serializer_class = PromotionSerializer
    permission_classes = [permissions.AllowAny]

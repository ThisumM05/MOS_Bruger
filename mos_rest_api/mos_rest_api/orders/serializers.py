from rest_framework import serializers
from .models import Order, OrderItem, OrderItemTopping
from users.models import User
from menu.models import Menu
from bike.models import Bike
from users.models import Delivery


class BikerIdField(serializers.IntegerField):
    def to_representation(self, value):
        if isinstance(value, Bike):
            return value.id
        return super().to_representation(value)

class OrderItemToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemTopping
        fields = ['topping_name', 'quantity', 'extra_price']

class OrderItemSerializer(serializers.ModelSerializer):
    toppings = OrderItemToppingSerializer(many=True)
    base_price = serializers.DecimalField(read_only=True, max_digits=8, decimal_places=2)
    class Meta:
        model = OrderItem
        fields = ['menu', 'quantity', 'base_price', 'toppings']

class OrderCreateUpdateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)
    assigned_biker = BikerIdField(required=False, allow_null=True)
    customer = serializers.SlugRelatedField(
        queryset=User.objects.filter(role__in=['CUSTOMER', 'STAFF']),
        slug_field='username',
        required=False
    )

    class Meta:
        model = Order
        fields = ['customer', 'status', 'items', 'assigned_staff', 'assigned_biker', 'street_address', 'city', 'payment_method']

    def validate_assigned_biker(self, value):
        # Frontend may send either a Bike id or a Delivery User id.
        if value is None:
            return value

        if isinstance(value, Bike):
            return value

        bike = Bike.objects.filter(id=value).first()
        if bike:
            return bike

        delivery = Delivery.objects.filter(user_id=value).select_related('bike').first()
        if delivery and delivery.bike:
            return delivery.bike

        raise serializers.ValidationError('Invalid biker selection. Choose a delivery user with an assigned bike.')

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        customer = validated_data.pop('customer', None)

        order = Order.objects.create(customer=customer, **validated_data)
        total = 0

        for item_data in items_data:
            toppings_data = item_data.pop('toppings', [])
            menu = item_data['menu']
            base_price = menu.base_price

            order_item = OrderItem.objects.create(
                order=order,
                menu=menu,
                quantity=item_data['quantity'],
                base_price=base_price
            )

            item_total = base_price
            for topping in toppings_data:
                topping_obj = OrderItemTopping.objects.create(order_item=order_item, **topping)
                item_total += topping_obj.extra_price * topping_obj.quantity

            item_total *= order_item.quantity
            total += item_total

        order.total_amount = total
        order.save()
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            total = 0
            for item_data in items_data:
                toppings_data = item_data.pop('toppings', [])
                menu = item_data['menu']
                base_price = menu.base_price

                order_item = OrderItem.objects.create(
                    order=instance,
                    menu=menu,
                    quantity=item_data['quantity'],
                    base_price=base_price
                )

                item_total = base_price
                for topping in toppings_data:
                    topping_obj = OrderItemTopping.objects.create(order_item=order_item, **topping)
                    item_total += topping_obj.extra_price * topping_obj.quantity

                item_total *= order_item.quantity
                total += item_total

            instance.total_amount = total
            instance.save()

        return instance

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'total_amount', 'items', 'created_at', 'assigned_staff', 'assigned_biker', 'street_address', 'city', 'payment_method']
from rest_framework import serializers
from .models import Menu, Category
# -------------------------------
# Menu Serializer (for list)
# -------------------------------
class MenuSerializer(serializers.ModelSerializer):

    class Meta:
        model = Menu
        fields = ['id', 'name', 'description', 'base_price', 'is_available']

# -------------------------------
# Menu Detail Serializer
# -------------------------------
class MenuDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Menu
        fields = ['id', 'category', 'name', 'description', 'base_price', 'is_available']

# -------------------------------
# Category Serializer
# -------------------------------
class CategorySerializer(serializers.ModelSerializer):
    menus = MenuSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'menus', 'description']


# -------------------------------
# Category Create/Update Serializer
# -------------------------------
class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


# -------------------------------
# Menu Create/Update Serializer
# -------------------------------
class MenuCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['category', 'name', 'description', 'base_price', 'is_available']


# -------------------------------
# Menu Topping Create/Update Serializer (for POST/PUT)
# -------------------------------
class MenuToppingCreateUpdateSerializer(serializers.Serializer):
    topping_id = serializers.IntegerField()
    count = serializers.IntegerField()


# -------------------------------
# Menu with Toppings Create/Update
# -------------------------------
# NOTE: MenuTopping model was removed in migration 0006
# This serializer is kept for reference but should not be used
# class MenuWithToppingsCreateUpdateSerializer(serializers.ModelSerializer):
#     toppings = MenuToppingCreateUpdateSerializer(many=True)

#     class Meta:
#         model = Menu
#         fields = ['id', 'category', 'name', 'description', 'base_price', 'is_available', 'toppings']

#     def create(self, validated_data):
#         toppings_data = validated_data.pop('toppings', [])
#         menu = Menu.objects.create(**validated_data)
#         return menu

#     def update(self, instance, validated_data):
#         toppings_data = validated_data.pop('toppings', None)

#         # Update menu fields
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()
#         return instance

from .models import Promotion

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'

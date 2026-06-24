from .models import Topping
from rest_framework import serializers

class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ['id', 'category', 'name', 'extra_price', 'amount', 'image_url']

class ToppingCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ['category', 'name', 'extra_price', 'amount', 'image_url']


from rest_framework import serializers
from .models import Bike

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['id', 'model_name', 'brand', 'price_per_hour', 'is_available']
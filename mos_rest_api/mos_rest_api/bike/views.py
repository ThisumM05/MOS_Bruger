from rest_framework.viewsets import  ModelViewSet
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Bike
from .serializers import BikeSerializer


class BikeViewSet(ModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer

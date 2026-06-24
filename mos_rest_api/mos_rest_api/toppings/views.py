from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from .models import Topping
from .serializers import (ToppingSerializer,
                          ToppingCreateUpdateSerializer)

class ToppingViewSet(ModelViewSet):
    queryset = Topping.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ToppingSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ToppingCreateUpdateSerializer
        return ToppingSerializer
# Create your views here.

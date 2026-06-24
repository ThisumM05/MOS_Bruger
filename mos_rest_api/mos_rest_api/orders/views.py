from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer, OrderCreateUpdateSerializer
from .forecasting import build_demand_forecast


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OrderCreateUpdateSerializer
        return OrderSerializer

    @action(detail=False, methods=['get'], url_path='demand-forecast')
    def demand_forecast(self, request):
        history_days = request.query_params.get('history_days', '120')
        horizon_days = request.query_params.get('horizon_days', '7')

        try:
            history_days = max(30, min(365, int(history_days)))
        except ValueError:
            history_days = 120

        try:
            horizon_days = max(3, min(30, int(horizon_days)))
        except ValueError:
            horizon_days = 7

        payload = build_demand_forecast(
            history_days=history_days,
            horizon_days=horizon_days,
            top_items=5,
        )
        return Response(payload)

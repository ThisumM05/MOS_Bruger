from rest_framework.routers import DefaultRouter
from .views import BikeViewSet

router = DefaultRouter()
router.register('bikes', BikeViewSet)

urlpatterns = router.urls

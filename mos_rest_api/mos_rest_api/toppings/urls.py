from rest_framework.routers import DefaultRouter
from .views import ToppingViewSet

router = DefaultRouter()
router.register('toppings', ToppingViewSet)

urlpatterns = router.urls


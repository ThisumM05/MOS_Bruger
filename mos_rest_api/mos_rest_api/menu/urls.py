from rest_framework.routers import DefaultRouter
from .views import MenuViewSet, CategoryViewSet, PromotionViewSet

router = DefaultRouter()

router.register('menu', MenuViewSet)
router.register('categories', CategoryViewSet)
router.register('promotions', PromotionViewSet, basename='promotion')

urlpatterns = router.urls


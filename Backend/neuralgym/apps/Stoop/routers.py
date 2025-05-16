from rest_framework.routers import DefaultRouter
from apps.Stoop.views import Stoop

router = DefaultRouter()
router.register(r'', Stoop, basename='prueba_stoop')

urlpatterns = router.urls
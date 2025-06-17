from rest_framework.routers import DefaultRouter
from apps.Digitos.views import Digitos

router = DefaultRouter()
router.register(r'', Digitos, basename='prueba_digitos')

urlpatterns = router.urls

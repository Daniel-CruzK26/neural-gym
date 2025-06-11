from rest_framework.routers import DefaultRouter
from apps.Digitos.views import DigitosTest

router = DefaultRouter()
router.register(r'', DigitosTest, basename='prueba_digitos')

urlpatterns = router.urls
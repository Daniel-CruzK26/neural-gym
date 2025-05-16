from rest_framework.routers import DefaultRouter
from apps.Simbolos.views import SimbolosTest

router = DefaultRouter()
router.register(r'', SimbolosTest, basename='Simbolos_test')
urlpatterns = router.urls


from rest_framework.routers import DefaultRouter
from apps.colorandMean.views import ColorMeanTest

router = DefaultRouter()
router.register(r'', ColorMeanTest, basename='Prueba_Colormania')
urlpatterns = router.urls

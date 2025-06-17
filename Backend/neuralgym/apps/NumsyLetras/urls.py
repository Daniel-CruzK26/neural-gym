from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TextoRecognizer  # Este debe ser tu nuevo ViewSet que contiene procesar_texto

router = DefaultRouter()
router.register(r'letras', TextoRecognizer, basename='letras')

urlpatterns = [
    path('api/', include(router.urls)),  # Tendrás /api/letras/procesar_texto/
]

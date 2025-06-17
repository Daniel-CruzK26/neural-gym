from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TextoRecognizer

router = DefaultRouter()
router.register(r'letras', TextoRecognizer, basename='letras')

urlpatterns = [
    path('api/', include(router.urls)),  # Esto crea /api/letras/procesar_texto/
]

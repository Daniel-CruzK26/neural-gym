from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import Digitos

router = DefaultRouter()
router.register(r'digitos', Digitos, basename='digitos')

urlpatterns = [
    path('api/', include(router.urls)),  # Esto incluye /api/digitos/procesar_audio/
]

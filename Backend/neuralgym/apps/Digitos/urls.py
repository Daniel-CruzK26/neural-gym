from django.urls import path
from .views import procesar_audio

urlpatterns = [
    path('procesar-audio/', procesar_audio),
]
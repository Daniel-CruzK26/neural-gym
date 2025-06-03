from django.urls import path
from .views import VistaProtegida

urlpatterns = [
    path('protegido/', VistaProtegida.as_view(), name='vista-protegida'),
]

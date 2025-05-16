from django.urls import path
from .views import PruebaListView

urlpatterns = [
    path('actividades/', PruebaListView.as_view(), name='lista_actividades'),
]

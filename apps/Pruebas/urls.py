from django.urls import path
from .views import PruebaListView, ScoresListView

urlpatterns = [
    path('actividades/', PruebaListView.as_view(), name='lista_actividades'),
    path('scores/', ScoresListView.as_view(), name= 'lista_de_scores'),
]

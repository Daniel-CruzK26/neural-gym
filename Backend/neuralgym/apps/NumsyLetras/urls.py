from . import views
from django.urls import path

# urlpatterns = [
#     path("", views.home, name = "home")
# ]
urlpatterns = [
    path('procesar_texto/', views.procesar_texto, name='procesar_texto'),
]
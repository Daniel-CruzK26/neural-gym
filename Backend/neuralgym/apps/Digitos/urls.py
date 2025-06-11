from . import views
from django.urls import path

# urlpatterns = [
#     path("", views.home, name = "home")
# ]
urlpatterns = [
    path('procesar_audio/', views.procesar_audio, name='procesar_audio'),
]
from django.urls import path
from .views import SimpleLoginView

urlpatterns = [
    path('login22/', SimpleLoginView.as_view(), name='simple-login'),
]

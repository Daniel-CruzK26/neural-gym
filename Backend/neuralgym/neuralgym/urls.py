from django.urls import re_path
from rest_framework import permissions
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.User.views import Login
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', Login.as_view(), name='custom_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('puzzles-visuales/', include('apps.PuzzlesVisuales.urls')),
    path('stoop/', include('apps.Stoop.routers')),
    path('ColorMean/', include('apps.colorandMean.routers')),
    path('Simbolos/', include('apps.Simbolos.routers')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

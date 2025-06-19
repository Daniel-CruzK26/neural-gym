from django.urls import re_path
from rest_framework import permissions
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.User.views import Login, RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', Login.as_view(), name='custom_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('puzzles-visuales/', include('apps.PuzzlesVisuales.routers')),
    path('digitos/', include('apps.Digitos.urls')),
    path('numyletras/', include('apps.NumsyLetras.urls')),
    path('stoop/', include('apps.Stoop.routers')),
    path('ColorMean/', include('apps.colorandMean.routers')),
    path('Simbolos/', include('apps.Simbolos.routers')),
    path('pruebas/', include('apps.Pruebas.urls')),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/', include('apps.User.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

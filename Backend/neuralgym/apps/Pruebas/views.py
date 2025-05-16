from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prueba
from .serializers import ActivitySerializer

class PruebaListView(APIView):
    def get(self, request):
        actividades = Prueba.objects.filter(is_active=True)  # Solo mostrar actividades activas
        serializer = ActivitySerializer(actividades, many=True)
        return Response(serializer.data)


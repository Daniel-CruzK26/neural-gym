from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prueba, PuntajePruebas
from .serializers import ActivitySerializer, ScoreSerializer

class PruebaListView(APIView):
    def get(self, request):
        actividades = Prueba.objects.filter(is_active=True)  # Solo mostrar actividades activas
        serializer = ActivitySerializer(actividades, many=True)
        return Response(serializer.data)

class ScoresListView(APIView):
    def get(self, request):
        scores = PuntajePruebas.objects.filter(user = 1)
        scores_serializer = ScoreSerializer(scores, many=True).data
        return Response(scores_serializer)


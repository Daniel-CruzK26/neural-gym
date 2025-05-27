from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Prueba, PuntajePruebas
from .serializers import ActivitySerializer, ScoreSerializer

class PruebaListView(APIView):
    def get(self, request):
        actividades = Prueba.objects.filter(is_active=True)  # Solo mostrar actividades activas
        serializer = ActivitySerializer(actividades, many=True)
        return Response(serializer.data)

class ScoresListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = PuntajePruebas.objects.filter(user=request.user).order_by("-id")
        serializer = ScoreSerializer(scores, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ScoreSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # asignar el usuario autenticado
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


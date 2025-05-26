from rest_framework import serializers
from .models import Prueba, PuntajePruebas

class ActivitySerializer(serializers.ModelSerializer):
    categoria = serializers.CharField(source='categoria.nameCategoria')
    class Meta:
        model = Prueba
        fields = ['id', 'name', 'categoria', 'game_url']
        
class ScoreSerializer(serializers.ModelSerializer):
    prueba = serializers.CharField(source='prueba.name')
    class Meta:
        model = PuntajePruebas
        fields=['prueba', 'score']

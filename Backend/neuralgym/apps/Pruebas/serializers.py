from rest_framework import serializers
from .models import Prueba, PuntajePruebas

class ActivitySerializer(serializers.ModelSerializer):
    categoria = serializers.CharField(source='categoria.nameCategoria')
    game_url = serializers.SerializerMethodField()

    class Meta:
        model = Prueba
        fields = ['id', 'name', 'categoria', 'game_url', 'descrp_breve', 'image']

    def get_game_url(self, obj):
        # Si ya tiene una URL válida (empieza con "/"), la usamos tal cual
        if obj.game_url and obj.game_url.startswith('/'):
            return obj.game_url

        # En caso contrario, generamos una por nombre
        rutas = {
            'Prueba de Dígitos': '/digitos',
            'Stroop Test': '/stoop-test',
            'Puzzle Visual': '/puzzles',
            'TOVA': '/tova-test',
            'Signos': '/simbols-test',
            'Significado': '/meaning-test',
            'Números y Letras': '/nums-letras',
        }

        return rutas.get(obj.name, '/')  # fallback si no hay match
        
class ScoreSerializer(serializers.ModelSerializer):
    prueba = serializers.CharField(source='prueba.name')
    class Meta:
        model = PuntajePruebas
        fields=['prueba', 'score']

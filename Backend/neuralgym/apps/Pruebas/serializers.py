from rest_framework import serializers
from .models import Prueba

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Prueba
        fields = ['id', 'name', 'categoria', 'game_url']

from rest_framework import serializers
from .models import Prueba, PuntajePruebas

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Prueba
        fields = ['id', 'name', 'categoria', 'game_url']

class ScoreSerializer(serializers.ModelSerializer):
    prueba = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Prueba.objects.all()
    )

    class Meta:
        model = PuntajePruebas
        fields = ['score', 'prueba']

    def create(self, validated_data):
        user = self.context['request'].user
        return PuntajePruebas.objects.create(user=user, **validated_data)

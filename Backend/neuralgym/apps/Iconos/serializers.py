from rest_framework import serializers
from apps.Iconos.models import Icono

class IconoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icono
        fields = ['nombre', 'archivo']

        
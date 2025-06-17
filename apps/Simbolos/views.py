from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.Iconos.models import Icono
from apps.Iconos.serializers import IconoSerializer
import random

# Create your views here.

letras = ['A', 'B', 'C', 'D', 'H', 'X', 'K', 'I', 'G', 'U', 'V', 'Y', 'S']

colores = {
    'ROJO': '#FC1414',
    'AZUL': '#1D84F9',
    'MORADO': '#B227FD',
    'NEGRO': '#000000',
    'VERDE': '#62ED4A',
    'ROSA': '#F86FF2',
    'CAFE': '#9E6A20',
    'NARANJA': '#FF8811',
    'LILA': '#A475F7',
    'AQUA': '#79FADB'
}

class SimbolosTest(viewsets.GenericViewSet):
    
    @action(detail=False, methods=['post'])
    def startTest(self, request):
        ids = list(Icono.objects.filter(categoria = 'extras').values_list('id', flat=True))
        ids_iconos = random.sample(ids, min(5, len(ids)))
        iconos = Icono.objects.filter(id__in=ids_iconos)
        iconos_serializer = IconoSerializer(iconos, many=True).data
        
        letras_select = random.sample(letras, 5)
        hexs = random.sample(list(colores.items()), 5)
        
        for icono, letra, color in zip(iconos_serializer, letras_select, hexs):
            icono['hex'] = color[1]
            icono['letra'] = letra
        
        return Response(iconos_serializer)
    
    @action(detail=False, methods=['post'])
    def newOption(self, request):
        lista_letras = request.data.get('letras', [])
        lista_iconos = request.data.get('nombres', [])
        
        disponibles = Icono.objects.filter(
        categoria='extras'
        ).exclude(
            nombre__in=lista_iconos
        )

        if not disponibles.exists():
            return Response({'error': 'No hay más opciones disponibles.'}, status=400)

        nuevo_icono = random.choice(list(disponibles))
        icono_serializer = IconoSerializer(nuevo_icono).data
        
        color = random.choice(list(colores.items()))
        letras_disponibles = [l for l in letras if l not in lista_letras]
        letra_seleccionada = random.choice(letras_disponibles)
        
        icono_serializer['hex'] = color[1]
        icono_serializer['letra'] = letra_seleccionada
        return Response(icono_serializer)
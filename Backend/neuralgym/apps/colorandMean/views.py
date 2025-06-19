from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.Iconos.models import Icono
from apps.Iconos.serializers import IconoSerializer
import random

# Create your views here.
class ColorMeanTest(viewsets.GenericViewSet):
    
    @action(detail=False, methods=['post'])
    def startTest(self, request):
        num_opciones = request.data.get('nivel')
        num_figuras = num_opciones // 2
        num_numeros = num_opciones - num_figuras
        
        #Traemos 3 iconos mediante su id
        ids = list(Icono.objects.filter(categoria = 'figura').values_list('id', flat=True))
        ids_aleatorios = random.sample(ids, min(num_figuras, len(ids)))
        iconos_figuras = Icono.objects.filter(id__in=ids_aleatorios)
        
        #Traemos 3 íconos de números
        ids_numbers = list(Icono.objects.filter(categoria = 'numero').values_list('id', flat=True))
        ids_aleatorios = random.sample(ids_numbers, min(num_numeros, len(ids_numbers)))
        iconos_numeros = Icono.objects.filter(id__in=ids_aleatorios)
        
        options = list(iconos_numeros) + list(iconos_figuras) #Unimos todos los iconos en una sola lista
        random.shuffle(options)
        icons_serializer = IconoSerializer(options, many=True).data #Serializamos para hacer cada uno en formato json
        
        hexs = random.sample(list(colores.items()), 6) #Seleccionamos 6 colores aleatoriamente
        random.shuffle(hexs) #Mezclamos los colores
        for icon, color in zip(icons_serializer, hexs): #A cada instancia de icono (Dict) le alegramos el campo para el color
            icon['hex'] = color[1]
        
        #--------------------Generamos X pruebas para el test-----------------#
        
        name_figuras = [icon['nombre'] for icon in icons_serializer]
        name_colores = [color[0] for color in hexs]
        total_palabras = name_figuras + name_colores
        pruebas = []
        for _ in range(15):
            obj = random.choice(['SIGNIFICADO', 'COLOR'])
            if obj == 'SIGNIFICADO':
                word = random.choice(name_figuras)
            else:
                word = random.choice(total_palabras)
            hex = random.choice(hexs)[1]
            pruebas.append({'objetivo': obj, 'word': word, 'hex': hex})
        
        #--------------------Generamos X pruebas para el test-----------------#
        
        return Response({
            'options': icons_serializer, #Lista de JSON con los iconos y sus respectivos colores
            'pruebas': pruebas
        })

colores = {
    'ROJO': '#FC1414',
    'AZUL': '#1D84F9',
    'TURQUESA': '#1BFEE2',
    'MORADO': '#B227FD',
    'NEGRO': '#000000',
    'AMARILLO': '#EBF51B',
    'VERDE': '#62ED4A',
    'GRIS': '#A6ACA5',
    'ROSA': '#F86FF2',
    'CAFE': '#9E6A20',
    'NARANJA': '#FF8811',
    'LILA': '#A475F7',
}
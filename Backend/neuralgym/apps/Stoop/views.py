from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import random

# Create your views here.
nombres_colores = ["Azul", "Amarillo", "Rojo", "Naranja", "Verde", "Morado"]

color_fondo = {
    'Azul': '#5ab9fe',
    'Rojo': '#fe3838',
    'Verde': '#7bfd64',
    'Morado': '#c775fa',
    'Amarillo': '#faff66',
    'Naranja': '#ffb357',
}

color_letras = ['#0117f0', '#d11414', '#08b12e', '#7908b1', '#c4c120', '#f57e00']

def niveles(nivel):
    name_color = random.choice(nombres_colores)
    objetivo, hex = random.choice(list(color_fondo.items()))
    opciones = nombres_colores
    
    random.shuffle(opciones)
    if nivel == 3:
        hexs = [hex for _, hex in color_fondo.items()]
        font_color = color_letras
    elif nivel == 2:
        hexs = ['#b6d1f8']*6
        font_color = color_letras
    elif nivel == 1:
        hexs = ['#b6d1f8']*6
        font_color = ['#000000'] * 6
    
    random.shuffle(hexs)
    random.shuffle(font_color)
    random.shuffle(opciones)
    opc = zip(opciones, hexs, font_color)
    
    return {
        'nombre_color': name_color,
        'color_objetivo': objetivo,
        'hex': hex,
        'opciones': opc,
    }
    

def obtenerPrueba():
    name_color = random.choice(nombres_colores)
    letra, hex = random.choice(list(color_fondo.items()))
    
    return {
        'nombre_color': name_color,
        'color_objetivo': letra,
        'hex': hex,
    }

class Stoop(viewsets.GenericViewSet):
    
    @action(detail=False, methods=['get'])
    def generarPrueba(self, request):
        nueva_prueba = obtenerPrueba()
        return Response(nueva_prueba)
        
    @action(detail=False, methods=['post'])
    def getTest(self, request):
        nivel = request.data.get('nivel')
        
        try:
            nivel = int(nivel) 
        except ValueError:
            return Response({'error': 'Nivel inválido'}, status=400)
        
        juego = niveles(nivel)
        return Response(juego)
        

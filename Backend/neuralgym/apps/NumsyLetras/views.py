import os
import wave
import json
import ffmpeg
import string
from vosk import Model, KaldiRecognizer
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
import re


def limpiar_transcripcion(texto_recibido, phonetic_map):
    cleaned_text = texto_recibido.lower().translate(str.maketrans('', '', string.punctuation))
    raw_tokens = re.findall(r'[a-z]+|\d+', cleaned_text)
    
    interpretados = []
    for token in raw_tokens:
        if token in phonetic_map:
            interpretados.append(str(phonetic_map[token]))
        elif token.isdigit():
            for char_digit in token:
                interpretados.append(char_digit)
        elif token.isalpha():
            for char_letter in token:
                interpretados.append(char_letter)
    
    return interpretados

@api_view(['POST'])
@csrf_exempt

def procesar_texto(request): 
    if request.method != 'POST':
        return HttpResponse("Método no permitido", status=405)

    transcripcion_del_frontend = request.POST.get('transcripcion_texto', '')
    modo = request.POST.get('modo')
    
    try:
        secuencia_original = json.loads(request.POST.get('numeros', '[]'))
    except json.JSONDecodeError:
        return Response({"error": "Error al interpretar la secuencia original (JSON inválido)"}, status=400)

    if not modo or not secuencia_original:
        return Response({"error": "Datos incompletos (modo o secuencia original faltante)"}, status=400)

    phonetic_map = {
        "cero": "0", "uno": "1", "dos": "2", "tres": "3", "cuatro": "4",
        "cinco": "5", "seis": "6", "siete": "7", "ocho": "8", "nueve": "9",
        "a": "a", "be": "b", "b": "b", "ve": "b",
        "ce": "c", "c": "c", "se": "c",
        "de": "d", "d": "d",
        "e": "e",
        "efe": "f", "e fe": "f", "f": "f",
        "ge": "g", "je": "g", "g": "g",
        "hache": "h", "ache": "h", "h": "h",
        "i": "i", "&":"i",
        "jota": "j", "j": "j",
        "ka": "k", "ca": "k", "k": "k",
        "ele": "l", "l": "l",
        "eme": "m", "m": "m",
        "ene": "n", "n": "n",
        "o": "o",
        "pe": "p", "p": "p",
        "cu": "q", "q": "q",
        "erre": "r", "ere": "r", "r": "r",
        "ese": "s", "s": "s",
        "te": "t", "t": "t",
        "u": "u",
        "uve": "v", "ube": "v", "v": "v",
        "uve doble": "w", "doble ve": "w", "doble u": "w", "w": "w",
        "equis": "x", "x": "x",
        "ye": "y", "i griega": "y", "y": "y",
        "zeta": "z", "z": "z"
    }

    interpretados_usuario_str = limpiar_transcripcion(transcripcion_del_frontend, phonetic_map)

    temp_original_text = ' '.join([str(item) for item in secuencia_original])
    secuencia_original_normalizada = limpiar_transcripcion(' '.join([str(x) for x in secuencia_original]), phonetic_map)

    correcto = False
    puntos = 0
    esperado_str_final = []

    if modo == "Memoriza":
        esperado_str_final = secuencia_original_normalizada
        correcto = (interpretados_usuario_str == esperado_str_final)
        
    elif modo == "Ordena de menor a mayor":
        esperado_str_final = ordenar_mixto(secuencia_original_normalizada, 'asc')
        correcto = (interpretados_usuario_str == esperado_str_final)

    elif modo == "Ordena de mayor a menor":
        esperado_str_final = ordenar_mixto(secuencia_original_normalizada, 'desc')
        correcto = (interpretados_usuario_str == esperado_str_final)

    if correcto:
        puntos = 1

    resultado = {
        "modo": modo,
        "transcripcion": interpretados_usuario_str,
        "esperado": esperado_str_final,
        "correcto": correcto,
        "puntos": puntos,
        "numeros_mostrados": secuencia_original,
        "transcripcion_raw_frontend": transcripcion_del_frontend
    }

    return Response(resultado)

def ordenar_mixto(lista, orden):
        numeros = []
        letras = []

        # Separar números y letras
        for x in lista:
            s = str(x).lower()
            if s.isdigit():
                numeros.append(int(s)) # Convertir a int para el ordenamiento numérico
            else:
                letras.append(s)

        # Ordenar números según el modo especificado
        if orden == 'desc':
            numeros.sort(reverse=True)
        else: # 'asc'
            numeros.sort(reverse=False)

        # Ordenar letras según el modo especificado
        if orden == 'desc':
            letras.sort(reverse=True)
        else: # 'asc'
            letras.sort(reverse=False)
        
        # Combinar las listas: números primero, luego letras
        combined_list = numeros + letras
        
        # Convertir todos los elementos de vuelta a string para la salida consistente
        return [str(item) for item in combined_list]
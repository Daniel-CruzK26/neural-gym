import os
import wave
import json
import subprocess
import ffmpeg
import string
from vosk import Model, KaldiRecognizer
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
import re # Necesario para re.findall y string.punctuation


os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\bin"

try:
    #vosk_model = Model("/vosk-model-es-0.42")
    vosk_model = Model("/Users/valer/OneDrive/Documentos/Digitos/BackendDGT/memoria/myApp/vosk-model-es-0.42")
except Exception as e:
    print(f"Error al cargar el modelo Vosk: {e}")

AUDIO_DIR = os.path.join(settings.BASE_DIR, 'audios')
os.makedirs(AUDIO_DIR, exist_ok=True) 

def limpiar_transcripcion_a_numeros(texto_recibido, phonetic_map):
    cleaned_text = texto_recibido.lower().translate(str.maketrans('', '', string.punctuation))
    raw_tokens = re.findall(r'[a-z]+|\d+', cleaned_text)
    
    interpretados = []
    for token in raw_tokens:
        if token in phonetic_map:
            interpretados.append(int(phonetic_map[token])) 
        elif token.isdigit():
            for char_digit in token:
                interpretados.append(int(char_digit))
    
    return [x for x in interpretados if isinstance(x, int)] 

@api_view(['POST'])
@csrf_exempt
def procesar_audio(request):
    if request.method == 'POST':
        audio = request.FILES.get('audio')
        modo = request.POST.get('modo')
        numeros_originales = json.loads(request.POST.get('numeros', '[]'))

        if not audio or not modo or not numeros_originales:
            return Response("Datos incompletos", status=400)

        timestamp = now().strftime("%Y%m%d_%H%M%S_%f") 
        base_name = f"grabacion_{timestamp}"
        webm_path = os.path.join(AUDIO_DIR, f"{base_name}.webm")
        wav_path = os.path.join(AUDIO_DIR, f"{base_name}.wav")
        
        try:
            with open(webm_path, 'wb') as f:
                for chunk in audio.chunks():
                    f.write(chunk)
            print("Archivo guardado en:", webm_path, "Tamaño:", os.path.getsize(webm_path))

            ffmpeg_path = r'C:\ffmpeg\bin\ffmpeg.exe'

            subprocess.run(
                [ffmpeg_path, '-i', webm_path, '-ar', '16000', '-ac', '1', '-y', wav_path],
                check=True, # Esto hará que Python lance una excepción si ffmpeg falla
                capture_output=True,
                text=True
            )
            print(f"FFmpeg stdout: {subprocess.run([ffmpeg_path, '-i', webm_path, '-ar', '16000', '-ac', '1', '-y', wav_path], capture_output=True, text=True).stdout}")
            print(f"FFmpeg stderr: {subprocess.run([ffmpeg_path, '-i', webm_path, '-ar', '16000', '-ac', '1', '-y', wav_path], capture_output=True, text=True).stderr}")

        except subprocess.CalledProcessError as e:
            # CAMBIO: Captura errores específicos de subprocess (ffmpeg) y devuelve JSON
            print(f"Error de FFmpeg: {e.stderr}")
            return Response({"error": f"Error al convertir audio con FFmpeg: {e.stderr}"}, status=500)
        except Exception as e:
            # CAMBIO: Captura otros errores de archivo/conversión y devuelve JSON
            print(f"Error al guardar o convertir audio: {e}")
            return Response({"error": f"Error al guardar o convertir audio: {e}"}, status=500)
        finally:
            if os.path.exists(webm_path):
                os.remove(webm_path)

        texto_final_vosk = ""

        try:
            wf = wave.open(wav_path, "rb")
            if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
                wf.close() 
                return Response("El audio debe ser WAV mono 16kHz 16bit", status=400)
            
            rec = KaldiRecognizer(vosk_model, wf.getframerate())
            
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    texto_final_vosk += result.get("text", "") + " "
            
            result = json.loads(rec.FinalResult())
            texto_final_vosk += result.get("text", "")
            wf.close() 

        except Exception as e:
            print(f"Error durante transcripción con Vosk: {e}")
            return Response(f"Error durante transcripción: {e}", status=500)
        finally:
            if os.path.exists(wav_path):
                os.remove(wav_path)

        phonetic_map = {
            "cero": "0", "uno": "1", "dos": "2", "tres": "3", "cuatro": "4",
            "cinco": "5", "seis": "6", "siete": "7", "ocho": "8", "nueve": "9",
            "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", 
            "5": "5", "6": "6", "7": "7", "8": "8", "9": "9"
        }
        
        interpretados_usuario = limpiar_transcripcion_a_numeros(texto_final_vosk, phonetic_map)

        esperado_backend = []
        if modo == "Memoriza":
            esperado_backend = numeros_originales
        elif modo == "Ordena de mayor a menor":
            esperado_backend = sorted(numeros_originales, reverse=True)
        elif modo == "Ordena de menor a mayor":
            esperado_backend = sorted(numeros_originales, reverse=False)

        correcto = (interpretados_usuario == esperado_backend)
        puntuacion = 1 if correcto else 0

        resultado = {
            "numeros_mostrados": numeros_originales,
            "transcripcion": interpretados_usuario, 
            "modo": modo,
            "esperado": esperado_backend, 
            "correcto": correcto,
            "puntos": puntuacion
        }
        return Response(resultado)

    return HttpResponse("Método no permitido", status=405)
from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
import os, json, subprocess, wave, re, string
from vosk import Model, KaldiRecognizer

# Configuración
AUDIO_DIR = os.path.join(settings.MEDIA_ROOT, 'audios')
os.makedirs(AUDIO_DIR, exist_ok=True)
os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\bin"

try:
    model_path = os.path.join(os.path.dirname(__file__), 'vosk-model-es-0.42')
    vosk_model = Model(model_path)
except Exception as e:
    print(f"Error al cargar el modelo Vosk: {e}")


# Función auxiliar
def limpiar_transcripcion_a_numeros(texto_recibido, phonetic_map):
    cleaned_text = texto_recibido.lower().translate(str.maketrans('', '', string.punctuation))
    raw_tokens = re.findall(r'[a-z]+|\d+', cleaned_text)
    interpretados = []

    for token in raw_tokens:
        if token in phonetic_map:
            interpretados.append(int(phonetic_map[token]))
        elif token.isdigit():
            interpretados.extend([int(c) for c in token])

    return [x for x in interpretados if isinstance(x, int)]


class DigitosTest(viewsets.GenericViewSet):

    @action(detail=False, methods=['post'])
    def procesarAudio(self, request):
        audio = request.FILES.get('audio')
        modo = request.data.get('modo')
        numeros_originales = json.loads(request.data.get('numeros', '[]'))

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

            ffmpeg_path = r'C:\ffmpeg\bin\ffmpeg.exe'
            subprocess.run([ffmpeg_path, '-i', webm_path, '-ar', '16000', '-ac', '1', '-y', wav_path],
                           check=True, capture_output=True, text=True)

        except subprocess.CalledProcessError as e:
            return Response({"error": f"Error al convertir audio con FFmpeg: {e.stderr}"}, status=500)
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

        if modo == "Memoriza":
            esperado_backend = numeros_originales
        elif modo == "Ordena de mayor a menor":
            esperado_backend = sorted(numeros_originales, reverse=True)
        elif modo == "Ordena de menor a mayor":
            esperado_backend = sorted(numeros_originales)
        else:
            return Response({"error": "Modo no reconocido"}, status=400)

        correcto = interpretados_usuario == esperado_backend
        puntuacion = 1 if correcto else 0

        return Response({
            "numeros_mostrados": numeros_originales,
            "transcripcion": interpretados_usuario,
            "modo": modo,
            "esperado": esperado_backend,
            "correcto": correcto,
            "puntos": puntuacion
        })

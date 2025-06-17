# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import shutil
import os
import uuid
import random
import cv2
import numpy as np
from PIL import Image
from django.templatetags.static import static
from django.conf import settings

def generar_piezas2(img, cantidad_distractores=3, tamaño_range=(620, 650)):
    def generar_piezas_correctas(shape):
        h, w = shape[:2]
        masks = [np.zeros((h, w), dtype=np.uint8) for _ in range(3)]

        if random.choice(["vertical", "horizontal"]) == "vertical":
            x1 = random.randint(w // 6, w // 2)
            x2 = random.randint(w // 2, 6 * w // 8)
            pts1 = np.array([[0, 0], [x1, 0], [x1 - random.randint(100, 130), h], [0, h]], np.int32)
            pts2 = np.array([[x2, 0], [w, 0], [w, h], [x2 + random.randint(100, 130), h]], np.int32)
            cv2.fillPoly(masks[0], [pts1], 255)
            cv2.fillPoly(masks[1], [pts2], 255)
        else:
            y1 = random.randint(h // 6, h // 2)
            y2 = random.randint(h // 2, 6 * h // 8)
            pts1 = np.array([[0, 0], [w, 0], [w, y1], [0, y1 - random.randint(60, 80)]], np.int32)
            pts2 = np.array([[0, y2], [w, y2 + random.randint(60, 80)], [w, h], [0, h]], np.int32)
            cv2.fillPoly(masks[0], [pts1], 255)
            cv2.fillPoly(masks[1], [pts2], 255)

        masks[2] = cv2.bitwise_not(cv2.bitwise_or(masks[0], masks[1]))
        return masks

    def generar_distractores(img, num, tamaño_range):
        h, w, _ = img.shape
        distractores = []
        for _ in range(num):
            for _ in range(20):
                dh = min(random.randint(*tamaño_range), h - 1)
                dw = min(random.randint(*tamaño_range), w - 1)
                x = random.randint(0, w - dw)
                y = random.randint(0, h - dh)
                recorte = img[y:y+dh, x:x+dw]
                num_vertices = random.randint(3, 6)
                pts = np.array([[random.randint(0, dw), random.randint(0, dh)] for _ in range(num_vertices)], np.int32)
                pts = cv2.convexHull(pts)
                mask = np.zeros((dh, dw), dtype=np.uint8)
                cv2.fillPoly(mask, [pts], 255)
                recorte_irregular = cv2.bitwise_and(recorte, recorte, mask=mask)
                if np.mean(cv2.cvtColor(recorte_irregular, cv2.COLOR_BGR2GRAY)) > 40:
                    distractores.append(recorte_irregular)
                    break
        return distractores

    # === Generación de piezas correctas ===
    mask_piezas = generar_piezas_correctas(img.shape)
    piezas_correctas = [cv2.bitwise_and(img, img, mask=mask) for mask in mask_piezas]

    # === Generación de piezas distractoras ===
    piezas_distractoras = generar_distractores(img, cantidad_distractores, tamaño_range)

    # === Guardar como PNGs con fondo transparente ===
    piezas_guardadas = {"correctas": [], "distractoras": []}

    for tipo, lista in [("correctas", piezas_correctas), ("distractoras", piezas_distractoras)]:
        for pieza in lista:
            gray = cv2.cvtColor(pieza, cv2.COLOR_BGR2GRAY)
            coords = cv2.findNonZero(gray)
            if coords is not None:
                x, y, w, h = cv2.boundingRect(coords)
                cropped = pieza[y:y+h, x:x+w]
                b, g, r = cv2.split(cropped)
                fondo_negro = (b == 0) & (g == 0) & (r == 0)
                alpha = np.where(fondo_negro, 0, 255).astype(np.uint8)
                rgba = cv2.merge([r, g, b, alpha])
                nombre = f"{uuid.uuid4().hex}.png"
                ruta = os.path.join(settings.MEDIA_ROOT, 'piezas', nombre)
                os.makedirs(os.path.dirname(ruta), exist_ok=True)
                Image.fromarray(rgba).save(ruta)
                piezas_guardadas[tipo].append(f"/media/piezas/{nombre}")

    return piezas_guardadas

def generar_piezas1(img):
    piezas_guardadas = {"correctas": [], "distractoras": []}
    carpeta_piezas = os.path.join(settings.MEDIA_ROOT, 'piezas')
    if os.path.exists(carpeta_piezas):
        shutil.rmtree(carpeta_piezas)
    os.makedirs(carpeta_piezas, exist_ok=True)
    
    kernel = np.ones((2,2))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    canny = cv2.Canny(gray, 10, 150)
    closing = cv2.morphologyEx(canny, cv2.MORPH_CLOSE, kernel)
    heigth, width, _ = img.shape
    
    cnts, _ = cv2.findContours(closing, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for c in cnts:
        mask = np.zeros((heigth, width), np.uint8)
        cv2.drawContours(mask, [c], 0, 255, cv2.FILLED)
        figura = cv2.bitwise_and(img, img, mask=mask)
        
        x,y,w,h = cv2.boundingRect(c)
        figura_crop = figura[y:y+h, x:x+w]
        mask_crop = mask[y:y+h, x:x+w]
        b, g, r = cv2.split(figura_crop)
        rgba = cv2.merge([r, g, b, mask_crop])
        
        nombre = f"{uuid.uuid4().hex}.png"
        ruta = os.path.join(settings.MEDIA_ROOT, 'piezas', nombre)
        os.makedirs(os.path.dirname(ruta), exist_ok=True)
        Image.fromarray(rgba).save(ruta)
        piezas_guardadas["correctas"].append(f'/media/piezas/{nombre}')
    
    numeros = random.sample(range(1,11), 3)
    for num in numeros:
        piezas_guardadas["distractoras"].append(f'/media/distractoras/distract{num}.png')
    return piezas_guardadas

class GenerarPuzzleAPIView(APIView):
    def get(self, request):
        puzzles_usados = request.session.get('puzzles_usados', [])
        nivel = request.session.get('level', 1)
        print(puzzles_usados)
        print(nivel)
        
        if nivel == 1:
            todos_puzzles = [1,2,3,4]
        else:
            todos_puzzles = [1,2,3,4,5,6]
            
        puzzles_restantes = list(set(todos_puzzles) - set(puzzles_usados))
        
        if not puzzles_restantes and nivel == 2:
            return Response({"mensaje": "¡Ya viste todos los puzzles!"}, status=200)
        
        if not puzzles_restantes:
            request.session['level'] = 2
            nivel = 2
            request.session['puzzles_usados'] = []
            puzzles_usados = request.session.get('puzzles_usados', [])
            todos_puzzles = [1,2,3,4,5,6]
            puzzles_restantes = list(set(todos_puzzles) - set(puzzles_usados))
        
        number = random.choice(puzzles_restantes)
        # Cargar imagen base
        path_base = os.path.join(settings.BASE_DIR, 'static', f'puzzles{nivel}', f'figure{number}.png')
        img = cv2.imread(path_base)

        if nivel == 1:
            piezas = generar_piezas1(img)
        else:
            piezas = generar_piezas2(img)

        # Convertimos rutas relativas a URLs completas
        piezas["correctas"] = [request.build_absolute_uri(p) for p in piezas["correctas"]]
        piezas["distractoras"] = [request.build_absolute_uri(p) for p in piezas["distractoras"]]
        
        # Generar la URL de la figura base
        figura_base = static(f'puzzles{nivel}/figure{number}.png')  # ruta relativa a /static/
        figura_base_url = request.build_absolute_uri(figura_base)
        
        puzzles_usados.append(number)
        request.session['puzzles_usados'] = puzzles_usados
        print("ID de sesión:", request.session.session_key)

        # Incluir la URL en la respuesta
        return Response({
            "figura_base": figura_base_url,
            "correctas": piezas["correctas"],
            "distractoras": piezas["distractoras"],
        })
    
class ReiniciarPuzzleAPIView(APIView):
    def get(self, request):
        request.session.pop('puzzles_usados', None)
        request.session['level'] = 1
        return Response({"mensaje": "Progreso reiniciado."}, status=200)



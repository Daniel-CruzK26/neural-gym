from django.db import models
from apps.Pruebas.models import Prueba, PuntajePruebas

# Create your models here.
class Color(Prueba):
    pass

class ColorScore(PuntajePruebas):
    game = models.ForeignKey(Color, on_delete=models.CASCADE)

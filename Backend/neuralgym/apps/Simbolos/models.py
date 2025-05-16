from django.db import models
from apps.Pruebas.models import Prueba, PuntajePruebas

# Create your models here.
class Simbolos(Prueba):
    pass

class SimbolosScore(PuntajePruebas):
    game = models.ForeignKey(Simbolos, on_delete=models.CASCADE)

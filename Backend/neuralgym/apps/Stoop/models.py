from django.db import models
from apps.Pruebas.models import Prueba, PuntajePruebas

# Create your models here.
class Stoop(Prueba):
    pass

class StoopScore(PuntajePruebas):
    game = models.ForeignKey(Stoop, on_delete=models.CASCADE)

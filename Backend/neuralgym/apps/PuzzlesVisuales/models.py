from django.db import models
from apps.Pruebas.models import Prueba, PuntajePruebas
from apps.User.models import User

# Create your models here.
class PuzzleVisual(Prueba):
    pass

class PuzzleScore(PuntajePruebas):
    game = models.ForeignKey(PuzzleVisual, on_delete=models.CASCADE)
    

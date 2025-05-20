from django.db import models
from apps.User.models import User

# Create your models here.
class Categoria(models.Model):
    nameCategoria = models.CharField('Nombre de la categoria', max_length = 100, unique = True, blank = False, null = False)
    descripcion = models.CharField("Descripción de la categoria", max_length=250, blank = False, null = False)
    
    def __str__(self) -> str:
        return self.nameCategoria

class Prueba(models.Model):
    name = models.CharField('Nombre de la prueba', max_length = 255, unique = True, blank = False, null = False)
    categoria = models.ForeignKey(Categoria, on_delete = models.CASCADE, verbose_name = 'Categoria', null = True)
    tutorial = models.CharField('Tutorial de la prueba', max_length=350, blank = False, null = True)
    game_url = models.CharField('URL del juego', max_length =255, unique=True, blank =True, null = True)
    is_active = models.BooleanField(default = True)
    
    def __str__(self) -> str:
        return self.name

class PuntajePruebas(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prueba = models.ForeignKey(Prueba, on_delete=models.CASCADE)
    score = models.IntegerField(default=0) 
    
    

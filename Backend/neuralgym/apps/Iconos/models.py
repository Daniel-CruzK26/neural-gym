from django.db import models

# Create your models here.
class Icono(models.Model):
    nombre = models.CharField(max_length = 100)
    archivo = models.FileField(upload_to='iconos/')
    categoria = models.CharField(max_length=50, choices=[('figura', 'Figura'), ('numero', 'Número'), ('extras', 'Extras')], null=True, blank=True)

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def _create_user(self, email, username, password, is_staff, is_superuser, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username = username,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, username, password=None, **extra_fields):
        return self._create_user(email, username, password, False, False, **extra_fields)

    def create_superuser(self, email, username, password=None, **extra_fields):
        return self._create_user(email, username, password, True, True, **extra_fields)

    
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('Correo Electronico', max_length=255, unique=True, blank=False, null=False)
    username = models.CharField('Nombre de usuario', max_length = 255, unique=True, blank = False, null = False)
    password = models.CharField('Contraseña', max_length=255, unique=False, blank=False, null=False)
    memoryScore = models.FloatField('Escala de memoria', null=True, blank=True)
    atentionScore = models.FloatField('Escala de atención', null=True, blank=True)
    reasoningScore = models.FloatField('Escala de razonamiento', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) 
    is_superuser = models.BooleanField(default=False) 
    objects = UserManager()
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'username']
    
    def natural_key(self):
        return (self.email)
    
    def __str__(self):
        return f'{self.email}'

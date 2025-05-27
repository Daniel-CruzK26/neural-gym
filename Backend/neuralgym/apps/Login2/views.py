# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from apps.User.models import User
from apps.User.api.serializer import CustomUserSerializer

class SimpleLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'message': 'Correo y contraseña son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is not None:
            serializer = CustomUserSerializer(user)
            return Response({
                'message': 'Inicio de sesión exitoso',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
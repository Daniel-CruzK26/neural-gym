from rest_framework_simplejwt.views import TokenObtainPairView
from apps.User.api.serializer import CustomTokenObtainPairSerializer, CustomUserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

class Login(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        user = authenticate(
            request=request,
            email = email,
            password = password
        )
        
        if user:
            login_serializer = self.serializer_class(data = request.data)
            if login_serializer.is_valid():
                user_serializer = CustomUserSerializer(user)
                return Response({
                    'token': login_serializer.validated_data.get('access'),
                    'refresh-token': login_serializer.validated_data.get('refresh'),
                    'user': user_serializer.data,
                    'message': 'Inicio de sesión exitoso'
                }, status = status.HTTP_200_OK)
            return Response({'message': 'Contraseña o correo electrónico incorrectos'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Contraseña o correo electrónico incorrectos'}, status=status.HTTP_400_BAD_REQUEST)

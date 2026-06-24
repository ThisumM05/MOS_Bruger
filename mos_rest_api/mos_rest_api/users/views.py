from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User
from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'CUSTOMER')
        
        print(f"LOGIN ATTEMPT: email='{email}' password='{password}' role='{role}'")

        if email and password:
            # find user by email instead of username
            user = User.objects.filter(email=email, role=role).first()
            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UserSerializer(user).data
                })
            else:
                return Response(
                    {'detail': 'Invalid credentials or incorrect role selected.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        return Response(
            {'detail': 'Email and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['post'])
    def logout(self, request):
        return Response({'detail': 'Logout successful'})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Auto-login after signup
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

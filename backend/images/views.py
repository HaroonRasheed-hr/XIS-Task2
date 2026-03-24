from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.shortcuts import redirect
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
import os
import uuid
import hashlib
from .models import Image, UserProfile
from .serializers import ImageSerializer, SignupSerializer, LoginSerializer, UserProfileSerializer

def generate_token():
    """Generate a simple auth token"""
    return hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest()

@api_view(['GET'])
def api_root(request):
    """API root endpoint with welcome message"""
    return Response({
        'message': 'Welcome to XIS Wallet API',
        'version': '1.0.0',
        'endpoints': {
            'images': request.build_absolute_uri('/api/images/'),
            'auth/signup': request.build_absolute_uri('/api/auth/signup/'),
            'auth/login': request.build_absolute_uri('/api/auth/login/'),
            'admin': request.build_absolute_uri('/admin/'),
        }
    })

@api_view(['POST'])
def signup(request):
    """User signup endpoint"""
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = generate_token()
        user_profile = user.profile
        return Response({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'address': user_profile.address
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'detail': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check password
        if not user.check_password(password):
            return Response({
                'detail': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate token
        token = generate_token()
        user_profile = user.profile
        
        return Response({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'address': user_profile.address
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """Handle image upload"""
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get file extension
        ext = os.path.splitext(file.name)[1].lower().strip('.')
        if ext == 'jpeg':
            ext = 'jpg'
        
        # Format file size
        size_bytes = file.size
        if size_bytes < 1024:
            size_str = f'{size_bytes} B'
        elif size_bytes < 1048576:
            size_str = f'{size_bytes / 1024:.0f} KB'
        else:
            size_str = f'{size_bytes / 1048576:.1f} MB'
        
        # Create image object
        image = Image.objects.create(
            name=file.name,
            file=file,
            size=size_str,
            image_type=ext
        )
        
        serializer = self.get_serializer(image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """Delete an image"""
        image = self.get_object()
        image.delete()
        return Response({'message': 'Image deleted'}, status=status.HTTP_204_NO_CONTENT)

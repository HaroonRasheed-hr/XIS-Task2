from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import redirect
from django.core.files.base import ContentFile
from .models import Image
from .serializers import ImageSerializer
import os

@api_view(['GET'])
def api_root(request):
    """API root endpoint with welcome message"""
    return Response({
        'message': 'Welcome to XIS Wallet API',
        'version': '1.0.0',
        'endpoints': {
            'images': request.build_absolute_uri('/api/images/'),
            'admin': request.build_absolute_uri('/admin/'),
        }
    })

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

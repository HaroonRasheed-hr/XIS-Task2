from rest_framework import serializers
from .models import Image

class ImageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = ['id', 'name', 'size', 'type', 'url', 'date']
    
    def get_date(self, obj):
        return obj.date_uploaded.strftime('%b %d')
    
    def get_url(self, obj):
        if obj.file:
            return self.context['request'].build_absolute_uri(obj.file.url)
        return None
    
    def get_type(self, obj):
        return obj.image_type.lower()

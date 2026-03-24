from django.contrib import admin
from .models import Image

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ['name', 'image_type', 'size', 'date_uploaded']
    list_filter = ['image_type', 'date_uploaded']
    search_fields = ['name']

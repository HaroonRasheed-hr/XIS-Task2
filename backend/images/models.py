from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - Profile"

class Image(models.Model):
    name = models.CharField(max_length=255)
    file = models.ImageField(upload_to='images/')
    size = models.CharField(max_length=50)
    image_type = models.CharField(max_length=20)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_uploaded']
    
    def __str__(self):
        return self.name

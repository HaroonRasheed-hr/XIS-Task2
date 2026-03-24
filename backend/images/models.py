from django.db import models

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

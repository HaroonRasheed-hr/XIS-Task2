from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImageViewSet, api_root

router = DefaultRouter()
router.register(r'images', ImageViewSet, basename='image')

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', include(router.urls)),
]

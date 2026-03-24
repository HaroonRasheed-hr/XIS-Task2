from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImageViewSet, api_root, signup, login

router = DefaultRouter()
router.register(r'images', ImageViewSet, basename='image')

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/auth/signup/', signup, name='signup'),
    path('api/auth/login/', login, name='login'),
    path('api/', include(router.urls)),
]

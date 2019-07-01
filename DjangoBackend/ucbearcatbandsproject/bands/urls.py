from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from ..users.views import UserViewSet


# Create a router and register our viewsets in it
router = DefaultRouter()
router.register(r'students', views.StudentViewSet)
router.register(r'assets', views.AssetViewSet)
router.register(r'instruments', views.InstrumentViewSet)
router.register(r'users', UserViewSet)
router.register(r'uniforms', views.UniformViewSet)

# Include the viewset's urls, as well as our authentication urls
urlpatterns = [
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('', include(router.urls)),
]

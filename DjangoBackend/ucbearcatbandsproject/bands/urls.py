from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


# Create a router and register our viewsets in it
router = DefaultRouter()
router.register(r'students', views.StudentViewSet)

urlpatterns = [
    path('users/', include('ucbearcatbandsproject.users.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('', include(router.urls)),
]
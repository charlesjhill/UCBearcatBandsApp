from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


# Create a router and register our viewsets in it
router = DefaultRouter()
router.register(r'students', views.StudentViewSet)


urlpatterns = [
    path('', include(router.urls))
]
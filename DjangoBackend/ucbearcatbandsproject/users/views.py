from django.shortcuts import render
from rest_framework import generics, viewsets
from . import models
from . import serializers


# Create your views here.
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserSerializer

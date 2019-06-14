from rest_framework import serializers
from .models import Student
from..users.serializers import UserSerializer


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Student
        fields = ('m_number', 'user',)
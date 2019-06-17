from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.core.validators import RegexValidator
from rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer

from ucbearcatbandsproject.bands.models import Student
from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ('email', 'username', 'is_student')


class CustomUserDetailSerializer(UserDetailsSerializer):
    m_number = serializers.CharField(source="bands.student.m_number")

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('m_number', )

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('student', {})
        m_number = profile_data.get('m_number')

        instance = super(CustomUserDetailSerializer, self).update(instance, validated_data)

        # get and update student
        student = instance.student
        if profile_data and m_number:
            student.m_number = m_number
            student.save()
        return instance


class CustomRegisterSerializer(RegisterSerializer):
    is_student = serializers.BooleanField(default=False, required=False)
    m_number = serializers.CharField(required=False, validators=[RegexValidator(
                                    regex=r'[Mm]\d{8,8}',
                                    message='Please enter an M followed by 8 digits')])

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'is_student': self.validated_data.get('is_student', ''),
            'm_number': self.validated_data.get('m_number', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user.is_student = self.cleaned_data["is_student"]
        adapter.save_user(request, user, self)

        # We should probably use Django Signals here? IDK
        # Also, we should a let a client know they fucked up
        # if they said they were a student but didn't provide an mnumber
        if user.is_student and self.cleaned_data["m_number"]:
            m_num = self.cleaned_data["m_number"]
            stud = Student(m_number=m_num, user=user)
            stud.save()
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user
        

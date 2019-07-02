from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.core.validators import RegexValidator
from rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer

from ucbearcatbandsproject.bands.models import Student
from . import models


# Define the data to serialize when we request a User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ('username', 'full_name', 'email', 'is_student', )


# This is used to keep Users and the related 'Student' class in sync
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


# This serializer defines what we need to register users
class CustomRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(required=True)
    is_student = serializers.BooleanField(default=False, required=False)
    m_number = serializers.CharField(required=False, validators=[RegexValidator(
                                    regex=r'[Mm]\d{8}',
                                    message='Please enter an M followed by 8 digits')])

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'full_name': self.validated_data.get('full_name', ''),
            'is_student': self.validated_data.get('is_student', ''),
            'm_number': self.validated_data.get('m_number', ''),
        }

    # If we have any validation which requires knowledge of multiple fields, put them in here
    def validate(self, data):
        data = super().validate(data)  # Run through parent validators
        if data['is_student'] and 'm_number' not in data.keys() and data['m_number'] != '':
            raise serializers.ValidationError("If you are a student, you must enter an M-Number")
        return data

    # The process for saving users. Any extra steps we need to do (like change fields,
    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        self.cleaned_data["username"] = self.cleaned_data["email"].split('@')[0]
        user.is_student = self.cleaned_data["is_student"]
        user.full_name = self.cleaned_data["full_name"]
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


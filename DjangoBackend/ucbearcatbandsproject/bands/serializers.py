from rest_framework import serializers
from .models import Student, PurchaseInfo, Asset, Locker, MaitenanceReport, Instrument
from ..users.serializers import UserSerializer


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Student
        fields = ('m_number', 'user',)


class PurchaseInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseInfo
        fields = '__all__'


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'


class LockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locker
        fields = '__all__'


class MaitenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaitenanceReport
        fields = '__all__'


class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = '__all__'

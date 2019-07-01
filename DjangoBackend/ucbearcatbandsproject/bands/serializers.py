from rest_framework import serializers
from .models import Student, PurchaseInfo, Asset, Locker, MaintenanceReport, Instrument, UniformPiece
from ..users.serializers import UserSerializer


# Define serializers here
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
    current_owners = StudentSerializer(many=True, read_only=True)
    previous_owners = StudentSerializer(many=True, read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'


class InstrumentSerializer(AssetSerializer):
    class Meta:
        model = Instrument
        fields = '__all__'


class LockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locker
        fields = '__all__'


class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceReport
        fields = '__all__'


class UniformSerializer(AssetSerializer):
    class Meta:
        model = UniformPiece
        fields = '__all__'

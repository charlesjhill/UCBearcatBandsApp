from rest_framework import serializers
from . import models
from ..users.serializers import UserSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.Enrollment
        fields = '__all__'


# Students, Ensembles
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = models.Student
        fields = ('user', 'm_number', 'enrollments')

        # Controls how many layers of nested serializations should be done
        # e.g. 1 : Each enrollment is expanded;
        #      2 : enrollment .ensemble, .student, .assets are all expanded as well
        depth = 1


class EnsembleSerializer(serializers.ModelSerializer):
    members = StudentSerializer(many=True, read_only=True)
    
    class Meta:
        model = models.Ensemble
        fields = ('id', 'name', 'term', 'is_active', 'members', 'enrollments')
        depth = 1


class AssetAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AssetAssignment
        fields = '__all__'
        # depth = 1


# Assets
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Asset
        fields = '__all__'
        depth = 1


class InstrumentSerializer(AssetSerializer):
    class Meta(AssetSerializer.Meta):
        model = models.Instrument
        fields = '__all__'


class UniformSerializer(AssetSerializer):
    class Meta(AssetSerializer.Meta):
        model = models.UniformPiece
        fields = '__all__'


# Invoices
class PurchaseInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PurchaseInfo
        fields = '__all__'


class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MaintenanceReport
        fields = '__all__'


# Other
class LockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Locker
        fields = ('id', 'number', 'combination', 'assets')
        depth = 1

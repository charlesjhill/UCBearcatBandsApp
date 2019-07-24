from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from . import models
from ..users.serializers import UserSerializer

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


class AssetPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        models.Asset: AssetSerializer,
        models.Instrument: InstrumentSerializer,
        models.UniformPiece: UniformSerializer
    }


# Students, Ensembles
class StudentNoEnrollmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = models.Student
        fields = ('user', 'm_number')

        # Controls how many layers of nested serializations should be done
        # e.g. 1 : Each enrollment is expanded;
        #      2 : enrollment .ensemble, .student, .assets are all expanded as well
        depth = 1


class EnrollmentSerializer(serializers.ModelSerializer):
    assets = AssetPolymorphicSerializer(many=True)
    student = StudentNoEnrollmentSerializer(many=False)

    class Meta: 
        model = models.Enrollment
        fields = ('id', 'ensemble', 'student', 'assets')


class EnsembleSerializer(serializers.ModelSerializer):
    enrollments = EnrollmentSerializer(many=True)
    class Meta:
        model = models.Ensemble
        fields = ('id', 'name', 'term', 'is_active', 'enrollments')


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

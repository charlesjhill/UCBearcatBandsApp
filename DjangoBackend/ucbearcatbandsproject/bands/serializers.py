from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from . import models
from ..users.serializers import UserSerializer


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
    class Meta:
        model = models.Instrument
        exclude = ['polymorphic_ctype']
        depth = 1


class UniformSerializer(AssetSerializer):
    class Meta:
        model = models.UniformPiece
        exclude = ['polymorphic_ctype']
        depth = 1


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
        fields = ('pk', 'user', 'm_number')

        # Controls how many layers of nested serializations should be done
        # e.g. 1 : Each enrollment is expanded;
        #      2 : enrollment .ensemble, .student, .assets are all expanded as well
        depth = 1


class EnrollmentSerializer(serializers.ModelSerializer):
    assets = AssetPolymorphicSerializer(many=True, read_only=True)
    # student = StudentSerializer(many=False)

    class Meta: 
        model = models.Enrollment
        fields = ('id', 'ensemble', 'student', 'assets')


# Students, Ensembles
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    enrollments = EnrollmentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Student
        fields = ('user', 'm_number', 'enrollments')

        # Controls how many layers of nested serializations should be done
        # e.g. 1 : Each enrollment is expanded;
        #      2 : enrollment .ensemble, .student, .assets are all expanded as well
        depth = 1


class EnsembleEnrollmentSerializer(serializers.ModelSerializer):
    assets = AssetPolymorphicSerializer(many=True, read_only=True)
    student = StudentSerializer(many=False, read_only=True)

    class Meta:
        model = models.Enrollment
        fields = ('id', 'ensemble', 'student', 'assets')


class EnsembleSerializer(serializers.ModelSerializer):
    enrollments = EnsembleEnrollmentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Ensemble
        fields = ('id', 'name', 'term', 'is_active', 'enrollments')
        depth = 1


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

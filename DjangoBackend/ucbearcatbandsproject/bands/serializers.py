from rest_framework import serializers
from .models import Student, PurchaseInfo, Asset, Locker, MaintenanceReport, Instrument, UniformPiece, Ensemble, Enrollment, AssetAssignment
from ..users.serializers import UserSerializer

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Enrollment
        fields = '__all__'

# Students, Ensembles
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Student
        fields = ('user', 'm_number', 'enrollments')

        # Controls how many layers of nested serializations should be done
        # e.g. 1 : Each enrollment is expanded;
        #      2 : enrollment .ensemble, .student, .assets are all expanded as well
        depth = 1


class EnsembleSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True)
    
    class Meta:
        model = Ensemble
        fields = ('id', 'name', 'term', 'is_active', 'members')

class AssetAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetAssignment
        fields = '__all__'
        depth = 1

# Assets
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'
        depth = 1

class InstrumentSerializer(AssetSerializer):
    class Meta(AssetSerializer.Meta):
        model = Instrument
        fields = '__all__'

class UniformSerializer(AssetSerializer):
    class Meta(AssetSerializer.Meta):
        model = UniformPiece
        fields = '__all__'

# Invoices
class PurchaseInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseInfo
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceReport
        fields = '__all__'

# Other
class LockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locker
        fields = ('id', 'number', 'combination', 'assets')
        depth = 1

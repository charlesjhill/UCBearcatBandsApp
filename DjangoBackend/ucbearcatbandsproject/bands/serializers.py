from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from . import models
from ..users.serializers import UserSerializer


class ReadWriteSerializerMixin(object):
    """
    Overrides get_serializer_class to choose the read serializer
    for GET requests and the write serializer for POST requests.
    """
    read_serializer_class = None
    write_serializer_class = None

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return self.get_write_serializer_class()
        return self.get_read_serializer_class()

    def get_read_serializer_class(self):
        assert self.read_serializer_class is not None, (
            "'%s' should either include a `read_serializer_class` attribute,"
            "or override the `get_read_serializer_class()` method."
            % self.__class__.__name__
        )
        return self.read_serializer_class

    def get_write_serializer_class(self):
        assert self.write_serializer_class is not None, (
                "'%s' should either include a `write_serializer_class` attribute,"
                "or override the `get_write_serializer_class()` method."
                % self.__class__.__name__
        )
        return self.write_serializer_class


class AssetAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AssetAssignment
        fields = '__all__'


# Assets
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Asset
        fields = '__all__'


class InstrumentSerializer(AssetSerializer):
    class Meta:
        model = models.Instrument
        exclude = ['polymorphic_ctype']


class UniformSerializer(AssetSerializer):
    class Meta:
        model = models.UniformPiece
        exclude = ['polymorphic_ctype']


class AssetPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        models.Asset: AssetSerializer,
        models.Instrument: InstrumentSerializer,
        models.UniformPiece: UniformSerializer
    }


# Students, Ensembles
class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.Enrollment
        fields = ('id', 'ensemble', 'student', 'assets')

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = models.Student
        fields = ('user', 'm_number', 'enrollments')


class EnsembleSerializer(serializers.ModelSerializer):
    enrollments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Ensemble
        fields = ('id', 'name', 'term', 'start_date', 'end_date', 'enrollments')


# Invoices
class InvoiceSerializer(serializers.ModelSerializer):
    line_items = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    assets = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Invoice
        fields = ('id', 'date', 'vendor', 'invoice_number', 'notes', 'line_items', 'assets')


class LineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LineItem
        fields = ('id', 'type', 'cost', 'notes', 'asset', 'invoice')


# Other
class LockerSerializer(serializers.ModelSerializer):
    assets = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = models.Locker
        fields = ('id', 'number', 'combination', 'assets')

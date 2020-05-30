from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from ucbearcatbandsproject.bands.models import Instrument, Student
from . import models
from . import serializers


# Create your views here.
# We will probably want more complex filtering controls on these views.
# Details here: https://www.django-rest-framework.org/api-guide/filtering/

class StudentViewSet(viewsets.ModelViewSet):
    queryset = models.Student.objects.all()
    serializer_class = serializers.StudentSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter, )
    search_fields = ('m_number', 'user__full_name', )
    ordering_fields = ('user__full_name', )

    # We can add additional actions to a view like this
    # They will automatically get routed to a url too, which is handy
    @action(detail=True, methods=['get'])
    def instruments(self, request, pk=None):
        student: models.Student = self.get_object()
        instruments = Instrument.objects.filter(assignments__enrollment__student=student)
        serializer = serializers.InstrumentSerializer(instruments, many=True)
        return Response(serializer.data)


class EnsembleViewSet(viewsets.ModelViewSet):
    queryset = models.Ensemble.objects.all()
    serializer_class = serializers.EnsembleSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('name', 'term')


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = models.Enrollment.objects.all()
    serializer_class = serializers.EnrollmentSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('ensemble__name', 'student__user__full_name', )


class AssetAssignmentViewSet(viewsets.ModelViewSet):
    queryset = models.AssetAssignment.objects.all()
    serializer_class = serializers.AssetAssignmentSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('enrollment__student__user__full_name', 'asset__name', )


class AssetViewSet(viewsets.ModelViewSet):
    queryset = models.Asset.objects.all()
    serializer_class = serializers.AssetPolymorphicSerializer

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        asset: models.Asset = self.get_object()
        students = Student.objects.filter(enrollments__asset_assignments__asset=asset)
        serializer = serializers.StudentSerializer(students, many=True)
        return Response(serializer.data)


class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = models.Instrument.objects.all()
    serializer_class = serializers.InstrumentSerializer

    # How do we allow clients to search a particular field? Make the client do it?
    # Perhaps creating our own filter backend to more modularly do searches/filtering is the answer?
    # I.e. we could have a parameter `search_kind`, `search_make`, etc.
    filter_backends = (filters.SearchFilter, )
    search_fields = ('kind', 'make', 'model', 'uc_tag_number', 'uc_asset_number')

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        instrument: models.Instrument = self.get_object()
        students = Student.objects.filter(enrollments__asset_assignments__asset=instrument)
        serializer = serializers.StudentSerializer(students, many=True)
        return Response(serializer.data)


class UniformViewSet(viewsets.ModelViewSet):
    queryset = models.UniformPiece.objects.all()
    serializer_class = serializers.UniformSerializer

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        uniform: models.UniformPiece = self.get_object()
        students = Student.objects.filter(enrollments__asset_assignments__asset=uniform)
        serializer = serializers.StudentSerializer(students, many=True)
        return Response(serializer.data)


class LockerViewSet(viewsets.ModelViewSet):
    queryset = models.Locker.objects.all()
    serializer_class = serializers.LockerSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer


class LineItemViewSet(viewsets.ModelViewSet):
    queryset = models.LineItem.objects.all()
    serializer_class = serializers.LineItemSerializer

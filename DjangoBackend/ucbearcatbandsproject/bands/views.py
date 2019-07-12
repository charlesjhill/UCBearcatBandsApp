from rest_framework import viewsets, filters
from .models import Student, Asset, Instrument, UniformPiece, Ensemble, Enrollment, AssetAssignment
from .serializers import StudentSerializer, InstrumentSerializer, UniformSerializer, AssetSerializer, EnsembleSerializer, EnrollmentSerializer, AssetAssignmentSerializer


# Create your views here.
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter, )
    search_fields = ('m_number', 'user__full_name', )
    ordering_fields = ('user__full_name', )


class EnsembleViewSet(viewsets.ModelViewSet):
    queryset = Ensemble.objects.all()
    serializer_class = EnsembleSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class AssetAssignmentViewSet(viewsets.ModelViewSet):
    queryset = AssetAssignment.objects.all()
    serializer_class = AssetAssignmentSerializer


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer


class UniformViewSet(viewsets.ModelViewSet):
    queryset = UniformPiece.objects.all()
    serializer_class = UniformSerializer

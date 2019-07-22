from rest_framework import viewsets, filters
from .models import Student, Asset, Instrument, UniformPiece, Ensemble, Enrollment, AssetAssignment, Locker
import ucbearcatbandsproject.bands.models as models
from .serializers import StudentSerializer, InstrumentSerializer, UniformSerializer, AssetSerializer, EnsembleSerializer, EnrollmentSerializer, AssetAssignmentSerializer, LockerSerializer
import ucbearcatbandsproject.bands.serializers as serializers


# Create your views here.
# We will probably want more complex filtering controls on these views.
# Details here: https://www.django-rest-framework.org/api-guide/filtering/

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter, )
    search_fields = ('m_number', 'user__full_name', )
    ordering_fields = ('user__full_name', )


class EnsembleViewSet(viewsets.ModelViewSet):
    queryset = Ensemble.objects.all()
    serializer_class = EnsembleSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('__str__', )


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('ensemble__name', 'student__user__full_name', )


class AssetAssignmentViewSet(viewsets.ModelViewSet):
    queryset = AssetAssignment.objects.all()
    serializer_class = AssetAssignmentSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('enrollment__student__user__full_name', 'asset__name', )


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer
    # How to handle potentially searching a lot of fields? We could force a client to do this, but it does seem inefficient.
    # Perhaps creating our own filter backend to more modularly do searches/filtering is the answer?
    # I.e. we could have a parameter `search_kind`, `search_make`, etc.
    filter_backends = (filters.SearchFilter, )
    search_fields = ('kind', 'make', 'model', 'uc_tag_number', 'uc_asset_number')


class UniformViewSet(viewsets.ModelViewSet):
    queryset = UniformPiece.objects.all()
    serializer_class = UniformSerializer


class LockerViewSet(viewsets.ModelViewSet):
    queryset = Locker.objects.all()
    serializer_class = LockerSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = models.PurchaseInfo.objects.all()
    serializer_class = serializers.PurchaseInfoSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = models.MaintenanceReport.objects.all()
    serializer_class = serializers.MaintenanceSerializer
from rest_framework import viewsets, filters
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


class EnsembleViewSet(viewsets.ModelViewSet):
    queryset = models.Ensemble.objects.all()
    serializer_class = serializers.EnsembleSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('__str__', )


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
    serializer_class = serializers.AssetSerializer


class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = models.Instrument.objects.all()
    serializer_class = serializers.InstrumentSerializer

    # How do we allow clients to search a particular field? Make the client do it?
    # Perhaps creating our own filter backend to more modularly do searches/filtering is the answer?
    # I.e. we could have a parameter `search_kind`, `search_make`, etc.
    filter_backends = (filters.SearchFilter, )
    search_fields = ('kind', 'make', 'model', 'uc_tag_number', 'uc_asset_number')


class UniformViewSet(viewsets.ModelViewSet):
    queryset = models.UniformPiece.objects.all()
    serializer_class = serializers.UniformSerializer


class LockerViewSet(viewsets.ModelViewSet):
    queryset = models.Locker.objects.all()
    serializer_class = serializers.LockerSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = models.PurchaseInfo.objects.all()
    serializer_class = serializers.PurchaseInfoSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = models.MaintenanceReport.objects.all()
    serializer_class = serializers.MaintenanceSerializer

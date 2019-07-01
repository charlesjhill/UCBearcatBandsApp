from rest_framework import viewsets, filters
from .models import Student, Asset, Instrument, UniformPiece
from .serializers import StudentSerializer, AssetSerializer, InstrumentSerializer, UniformSerializer


# Create your views here.
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('m_number', )


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer

class UniformViewSet(viewsets.ModelViewSet):
    queryset = UniformPiece.objects.all()
    serializer_class = UniformSerializer

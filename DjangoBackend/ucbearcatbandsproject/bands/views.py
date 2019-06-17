from rest_framework import viewsets, filters
from .models import Student, Asset, Instrument
from .serializers import StudentSerializer, AssetSerializer, InstrumentSerializer


# Create your views here.
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ('first_name', 'last_name', 'm_number')
    # TODO: We can't actually sort on these anymore, apparently
    ordering_fields = ('first_name', 'last_name')


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer

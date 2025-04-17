from rest_framework import serializers, viewsets
from .models import Contractor
from rest_framework.routers import DefaultRouter

class ContractorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contractor
        fields = '__all__'

class ContractorViewSet(viewsets.ModelViewSet):
    queryset = Contractor.objects.all()
    serializer_class = ContractorSerializer

router = DefaultRouter()
router.register(r'contractors', ContractorViewSet)



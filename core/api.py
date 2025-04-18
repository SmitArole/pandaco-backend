from rest_framework import serializers, viewsets
from .models import Contractor
from .serializers import ContractorSerializer  
from rest_framework.routers import DefaultRouter

class ContractorViewSet(viewsets.ModelViewSet):
    queryset = Contractor.objects.all()
    serializer_class = ContractorSerializer

router = DefaultRouter()
router.register(r'contractors', ContractorViewSet)


from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from ..models import Contractor, PortfolioItem, Review, Connection
from .serializers import (
    ContractorSerializer,
    PortfolioItemSerializer,
    ReviewSerializer,
    ConnectionSerializer
)
from django.utils import timezone

@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    return Response({
        'status': 'success',
        'message': 'Backend is connected!',
        'data': {
            'api_version': '1.0',
            'timestamp': timezone.now().isoformat()
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def lovable_test(request):
    return Response({
        'status': 'success',
        'message': 'Lovable frontend is connected to Django backend!',
        'timestamp': timezone.now().isoformat(),
        'frontend_url': 'https://preview--panda-connect-frontend.lovable.app',
        'backend_url': 'http://127.0.0.1:8000'
    })

class ContractorViewSet(viewsets.ModelViewSet):
    queryset = Contractor.objects.all()
    serializer_class = ContractorSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def portfolio(self, request, pk=None):
        contractor = self.get_object()
        portfolio_items = PortfolioItem.objects.filter(contractor=contractor)
        serializer = PortfolioItemSerializer(portfolio_items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        contractor = self.get_object()
        reviews = Review.objects.filter(contractor=contractor)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def connections(self, request, pk=None):
        contractor = self.get_object()
        connections = Connection.objects.filter(contractor=contractor)
        serializer = ConnectionSerializer(connections, many=True)
        return Response(serializer.data)

class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = PortfolioItem.objects.all()
        contractor_id = self.request.query_params.get('contractor', None)
        if contractor_id is not None:
            queryset = queryset.filter(contractor_id=contractor_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save()

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Review.objects.all()
        contractor_id = self.request.query_params.get('contractor', None)
        if contractor_id is not None:
            queryset = queryset.filter(contractor_id=contractor_id)
        return queryset

class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Connection.objects.all()
        contractor_id = self.request.query_params.get('contractor', None)
        if contractor_id is not None:
            queryset = queryset.filter(contractor_id=contractor_id)
        return queryset

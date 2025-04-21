from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContractorViewSet,
    PortfolioItemViewSet,
    ReviewViewSet,
    ConnectionViewSet,
    test_connection
)

router = DefaultRouter()
router.register(r'contractors', ContractorViewSet, basename='contractor')
router.register(r'portfolio', PortfolioItemViewSet, basename='portfolio')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'connections', ConnectionViewSet, basename='connection')

urlpatterns = [
    path('', include(router.urls)),
    path('test/', test_connection, name='test-connection'),
]

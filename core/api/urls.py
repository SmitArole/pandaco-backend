from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContractorViewSet,
    PortfolioItemViewSet,
    ReviewViewSet,
    ConnectionViewSet,
    test_connection,
    lovable_test
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'contractors', ContractorViewSet, basename='contractor')
router.register(r'portfolio-items', PortfolioItemViewSet, basename='portfolio-item')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'connections', ConnectionViewSet, basename='connection')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    path('test-connection/', test_connection, name='test-connection'),
    path('lovable-test/', lovable_test, name='lovable-test'),
]

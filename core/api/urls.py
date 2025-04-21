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

router = DefaultRouter()
router.register(r'contractors', ContractorViewSet)
router.register(r'portfolio', PortfolioItemViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'connections', ConnectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test/', test_connection, name='test-connection'),
    path('lovable-test/', lovable_test, name='lovable-test'),
]

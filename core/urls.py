from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contractor/<int:contractor_id>/', views.contractor_profile, name='contractor_profile'),
    path('create-profile/', views.create_contractor_profile, name='create_contractor_profile'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
] 
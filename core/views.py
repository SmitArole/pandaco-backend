from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from .forms import CustomUserCreationForm, ContractorProfileForm
from .models import Contractor

# Create your views here.

def home(request):
    """View for the home page."""
    return render(request, 'core/home.html')

def contractor_profile(request, contractor_id):
    """View for displaying a contractor's profile."""
    contractor = get_object_or_404(Contractor, id=contractor_id)
    context = {
        'contractor': contractor,
        'title': f"{contractor.user.get_full_name()} - Contractor Profile"
    }
    return render(request, 'core/contractor_profile.html', context)

@login_required
def create_contractor_profile(request):
    """View for creating a contractor profile."""
    if hasattr(request.user, 'contractor'):
        return redirect('contractor_profile', contractor_id=request.user.contractor.id)
    
    if request.method == 'POST':
        form = ContractorProfileForm(request.POST, request.FILES)
        if form.is_valid():
            contractor = form.save(commit=False)
            contractor.user = request.user
            contractor.save()
            return redirect('contractor_profile', contractor_id=contractor.id)
    else:
        form = ContractorProfileForm()
    return render(request, 'core/create_profile.html', {'form': form})

def login_view(request):
    """View for user login."""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})

def logout_view(request):
    """View for user logout."""
    logout(request)
    return redirect('home')

def register(request):
    """View for user registration."""
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'core/register.html', {'form': form})

from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Contractor

class CustomUserCreationForm(UserCreationForm):
    is_contractor = forms.BooleanField(required=False, label='Register as a Contractor')
    trade = forms.CharField(max_length=100, required=False)
    hourly_rate = forms.DecimalField(max_digits=6, decimal_places=2, required=False)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'is_contractor', 'trade', 'hourly_rate')

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            if self.cleaned_data.get('is_contractor'):
                Contractor.objects.create(
                    user=user,
                    trade=self.cleaned_data['trade'],
                    hourly_rate=self.cleaned_data['hourly_rate']
                )
        return user

class ContractorProfileForm(forms.ModelForm):
    class Meta:
        model = Contractor
        fields = ['trade', 'hourly_rate', 'bio', 'profile_picture', 'skills']
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
            'skills': forms.TextInput(attrs={'placeholder': 'Comma-separated list of skills'}),
        } 
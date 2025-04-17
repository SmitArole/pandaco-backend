from django.db import models

# Create your models here.
from django.db import models

class Contractor(models.Model):
    name = models.CharField(max_length=100)
    trade = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    licensed = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.trade})"

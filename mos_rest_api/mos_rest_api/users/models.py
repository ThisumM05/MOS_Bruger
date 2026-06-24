from django.db import models
from django.contrib.auth.models import AbstractUser
from bike.models import Bike

class User(AbstractUser):
    ROLE_CHOICES = (
        ('CUSTOMER', 'Customer'),
        ('STAFF', 'Staff'),
        ('ADMIN', 'Admin'),
        ('DELIVERY', 'Delivery'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CUSTOMER')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

# users/models.py
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Delivery(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    license_number = models.CharField(max_length=50)
    bike = models.ForeignKey(Bike, blank=True, null=True, on_delete=models.SET_NULL)




        
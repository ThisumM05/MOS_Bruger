from django.db import models

# Create your models here.

class Bike(models.Model):
    model_name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    price_per_hour = models.DecimalField(max_digits=6, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.brand} {self.model_name} {self.price_per_hour} {self.is_available}"



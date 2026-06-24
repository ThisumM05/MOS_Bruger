from django.db import models

class Topping(models.Model):
    category = models.ForeignKey('menu.Category', related_name='toppings', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    extra_price = models.DecimalField(max_digits=5, decimal_places=2)
    amount = models.IntegerField(default=0)
    image_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.extra_price} - {self.amount}"
    

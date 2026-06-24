from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True, help_text='Icon class name like fa-hamburger')

    def __str__(self):
        return self.name

class Menu(models.Model):
    category = models.ForeignKey(Category, related_name='menus', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=6, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Promotion(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    promo_code = models.CharField(max_length=50, blank=True, null=True)
    background_color = models.CharField(max_length=20, default='#ffdb58')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

from django.db import models
from users.models import User
from menu.models import Menu
from bike.models import Bike

# -------------------------------
# Order
# -------------------------------
class Order(models.Model):
    STATUS_CHOICES = [
        ('WAITING_FOR_RIDER', 'Waiting for Rider'),
        ('RIDER_ASSIGNED', 'Rider Assigned'),
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    street_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    payment_method = models.CharField(max_length=50, default='CARD')
    assigned_staff = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='handled_orders')
    assigned_biker = models.ForeignKey(Bike, null=True, blank=True, on_delete=models.SET_NULL, related_name='deliveries')

    def __str__(self):
        return f"Order #{self.id} - {self.customer.username}"


# -------------------------------
# OrderItem (menu item in order)
# -------------------------------
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    base_price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.menu.name} x {self.quantity}"


# -------------------------------
# OrderItemTopping (snapshot)
# -------------------------------
class OrderItemTopping(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='toppings')
    topping_name = models.CharField(max_length=100)  
    quantity = models.PositiveIntegerField(default=1)
    extra_price = models.DecimalField(max_digits=6, decimal_places=2)


    def __str__(self):
        return f"{self.topping_name} x {self.quantity}"

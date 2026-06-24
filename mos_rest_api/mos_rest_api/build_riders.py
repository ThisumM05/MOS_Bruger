
from django.contrib.auth import get_user_model
from users.models import Delivery
from bike.models import Bike
User = get_user_model()
bike1, _ = Bike.objects.get_or_create(model_name='Ninja 300', brand='Kawasaki', defaults={'price_per_hour': 15.00, 'is_available': True})
bike2, _ = Bike.objects.get_or_create(model_name='CBR 250R', brand='Honda', defaults={'price_per_hour': 12.00, 'is_available': True})
user1, created1 = User.objects.get_or_create(username='rider1', defaults={'email': 'rider1@mosburger.com', 'role': 'DELIVERY'})
if created1:
    user1.set_password('Password123!')
    user1.save()
Delivery.objects.get_or_create(user=user1, defaults={'license_number': 'LIC12345', 'bike': bike1})

user2, created2 = User.objects.get_or_create(username='rider2', defaults={'email': 'rider2@mosburger.com', 'role': 'DELIVERY'})
if created2:
    user2.set_password('Password123!')
    user2.save()
Delivery.objects.get_or_create(user=user2, defaults={'license_number': 'LIC67890', 'bike': bike2})
print('Riders and Bikes added successfully.')

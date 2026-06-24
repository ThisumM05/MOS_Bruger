import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mos_rest_api.settings')
django.setup()

from users.models import User, Customer, Staff, Delivery

print("Deleting all existing users...")
User.objects.all().delete()

print("Creating new realistic users...")

# 1. Create Admin
admin = User.objects.create_superuser(
    username='ethadmin',
    first_name='Ethan',
    last_name='Hunt',
    email='ethan.admin@mosburger.com',
    password='adminpassword',
)
admin.role = 'ADMIN'
admin.save()
print("Created Admin user: Ethan Hunt")

# 2. Create Staff
staff = User.objects.create_user(
    username='sconnor',
    first_name='Sarah',
    last_name='Connor',
    email='sarah.staff@mosburger.com',
    password='staffpassword',
)
staff.role = 'STAFF'
staff.is_staff = True
staff.save()
Staff.objects.create(user=staff)
print("Created Staff user: Sarah Connor")

# 3. Create Customer
customer = User.objects.create_user(
    username='jwick',
    first_name='John',
    last_name='Wick',
    email='john.wick@gmail.com',
    password='customerpassword',
)
customer.role = 'CUSTOMER'
customer.save()
Customer.objects.create(user=customer)
print("Created Customer user: John Wick")

print("User reset complete.")
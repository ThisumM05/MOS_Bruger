import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mos_rest_api.settings')
django.setup()

from users.models import User, Customer, Staff, Delivery

# 1. Delete all non-superuser or all users
print("Deleting existing users...")
User.objects.all().delete()

print("Creating new users...")

# 2. Create Admin
admin = User.objects.create_superuser(
    username='admin',
    email='admin@mosburger.com',
    password='adminpassword',
)
admin.role = 'ADMIN'
admin.save()
print("Created Admin user: admin / adminpassword")

# 3. Create Staff
staff = User.objects.create_user(
    username='staff',
    email='staff@mosburger.com',
    password='staffpassword',
)
staff.role = 'STAFF'
staff.is_staff = True
staff.save()
Staff.objects.create(user=staff)
print("Created Staff user: staff / staffpassword")

# 4. Create Customer
customer = User.objects.create_user(
    username='customer',
    email='customer@mosburger.com',
    password='customerpassword',
)
customer.role = 'CUSTOMER'
customer.save()
Customer.objects.create(user=customer)
print("Created Customer user: customer / customerpassword")

print("User reset complete.")

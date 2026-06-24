import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mos_rest_api.settings")
django.setup()

from toppings.models import Topping
from menu.models import Category

# Clear out existing toppings just in case
Topping.objects.all().delete()

burger_cat = Category.objects.filter(name__icontains="Burger").first()
fries_cat = Category.objects.filter(name__icontains="Side").first()
drink_cat = Category.objects.filter(name__icontains="Drink").first()
dessert_cat = Category.objects.filter(name__icontains="Dessert").first()

if burger_cat:
    Topping.objects.create(category=burger_cat, name="Extra Cheese", extra_price=1.00, image_url="cheese")
    Topping.objects.create(category=burger_cat, name="Bacon", extra_price=1.50, image_url="bacon")
    Topping.objects.create(category=burger_cat, name="Jalapeno", extra_price=0.75, image_url="jalapeno")
    Topping.objects.create(category=burger_cat, name="Egg", extra_price=1.20, image_url="egg")

if fries_cat:
    Topping.objects.create(category=fries_cat, name="Cheese Sauce", extra_price=1.50, image_url="cheese")
    Topping.objects.create(category=fries_cat, name="BBQ Sauce", extra_price=0.50, image_url="sauce")
    Topping.objects.create(category=fries_cat, name="Spicy Mayo", extra_price=0.50, image_url="spicy")

if drink_cat:
    Topping.objects.create(category=drink_cat, name="Ice", extra_price=0.00, image_url="ice")
    Topping.objects.create(category=drink_cat, name="Lemon Slice", extra_price=0.20, image_url="lemon")
    Topping.objects.create(category=drink_cat, name="Pearl Boba", extra_price=0.80, image_url="boba")

if dessert_cat:
    Topping.objects.create(category=dessert_cat, name="Chocolate Syrup", extra_price=0.50, image_url="chocolate")
    Topping.objects.create(category=dessert_cat, name="Strawberry Sauce", extra_price=0.50, image_url="strawberry")
    Topping.objects.create(category=dessert_cat, name="Sprinkles", extra_price=0.30, image_url="sprinkles")

print("Created Toppings successfully!")

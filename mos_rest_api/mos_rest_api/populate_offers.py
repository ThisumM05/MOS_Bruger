import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mos_rest_api.settings')
django.setup()

from menu.models import Promotion

if Promotion.objects.count() == 0:
    print("Adding some offers/promotions...")
    Promotion.objects.create(
        title="Welcome Deal",
        description="Get 10% off your first burger!",
        promo_code="NEWMOS",
        background_color="#d82b2b"
    )
    Promotion.objects.create(
        title="Combo Special",
        description="Buy any 2 burgers, get free fries!",
        promo_code="FRIESFREE",
        background_color="#ffdb58"
    )
    Promotion.objects.create(
        title="Weekend Treats",
        description="Free drink with orders over $20",
        promo_code="WEEKEND20",
        background_color="#4CAF50"
    )
    print("Added 3 promotional offers!")
else:
    print("Promotions already exist in the database.")

from datetime import timedelta
from decimal import Decimal
import random

from django.utils import timezone

from users.models import User
from menu.models import Menu
from orders.models import Order, OrderItem, OrderItemTopping
from toppings.models import Topping


random.seed(2026)

customers = list(User.objects.filter(role="CUSTOMER").order_by("id"))
staff_users = list(User.objects.filter(role="STAFF").order_by("id"))
menus = list(Menu.objects.filter(is_available=True).order_by("id"))
toppings = list(Topping.objects.all().order_by("id"))

if not customers:
    raise RuntimeError("No customer users found")
if not staff_users:
    raise RuntimeError("No staff users found")
if not menus:
    raise RuntimeError("No menu items found")

cities = ["Colombo", "Kandy", "Galle", "Negombo", "Kurunegala", "Matara"]
streets = ["Main Street", "Lake Road", "Temple Lane", "Station Road", "Market Street", "Flower Road"]
statuses = ["COMPLETED", "COMPLETED", "COMPLETED", "PROCESSING", "PENDING", "WAITING_FOR_RIDER"]
payments = ["CARD", "CARD", "CASH"]

orders_to_create = 220
created_orders = 0
created_items = 0
created_toppings = 0

for index in range(orders_to_create):
    customer = random.choice(customers)
    assigned_staff = random.choice(staff_users)

    order = Order.objects.create(
        customer=customer,
        status=random.choice(statuses),
        street_address=f"{random.randint(10, 250)} {random.choice(streets)}",
        city=random.choice(cities),
        payment_method=random.choice(payments),
        assigned_staff=assigned_staff,
        total_amount=Decimal("0.00"),
    )

    days_ago = random.randint(0, 179)
    minutes_ago = random.randint(0, 1440)
    backdated = timezone.now() - timedelta(days=days_ago, minutes=minutes_ago)
    Order.objects.filter(id=order.id).update(created_at=backdated)

    item_count = random.randint(1, 4)
    selected_menus = random.sample(menus, k=min(item_count, len(menus)))
    order_total = Decimal("0.00")

    for menu_item in selected_menus:
        quantity = random.randint(1, 3)
        base_price = Decimal(str(menu_item.base_price))

        order_item = OrderItem.objects.create(
            order=order,
            menu=menu_item,
            quantity=quantity,
            base_price=base_price,
        )

        created_items += 1

        item_total = base_price * quantity

        topping_count = 0
        if toppings and random.random() < 0.65:
            topping_count = random.randint(1, min(3, len(toppings)))

        if topping_count > 0:
            selected_toppings = random.sample(toppings, k=topping_count)
            for topping in selected_toppings:
                t_qty = random.randint(1, 2)
                extra_price = Decimal(str(topping.extra_price))
                OrderItemTopping.objects.create(
                    order_item=order_item,
                    topping_name=topping.name,
                    quantity=t_qty,
                    extra_price=extra_price,
                )
                created_toppings += 1
                item_total += (extra_price * t_qty * quantity)

        order_total += item_total

    order.total_amount = order_total
    order.save(update_fields=["total_amount"])
    created_orders += 1

print("Historical forecast seed complete")
print("Created orders:", created_orders)
print("Created order items:", created_items)
print("Created order item toppings:", created_toppings)
print("Total orders now:", Order.objects.count())

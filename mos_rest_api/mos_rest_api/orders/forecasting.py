from datetime import timedelta

from django.db.models import Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from statsmodels.tsa.arima.model import ARIMA

from menu.models import Menu
from orders.models import OrderItem, OrderItemTopping


def _dense_series(date_map, start_date, end_date):
    series = []
    labels = []
    current = start_date
    while current <= end_date:
        labels.append(current)
        series.append(float(date_map.get(current, 0.0)))
        current += timedelta(days=1)
    return labels, series


def _forecast_values(series, horizon):
    if not series:
        return [0.0] * horizon, "Fallback(zeros)"

    has_variation = len(set(series)) > 1
    if len(series) >= 20 and has_variation:
        for order in ((2, 1, 2), (1, 1, 1), (1, 0, 1)):
            try:
                model = ARIMA(series, order=order)
                fit = model.fit()
                forecast = fit.forecast(steps=horizon)
                cleaned = [round(max(0.0, float(value)), 2) for value in forecast]
                return cleaned, f"ARIMA{order}"
            except Exception:
                continue

    # Fallback if ARIMA cannot fit due to sparse/noisy data.
    last_window = series[-7:] if len(series) >= 7 else series
    avg = sum(last_window) / max(1, len(last_window))
    return [round(max(0.0, avg), 2)] * horizon, "Fallback(moving-average)"


def build_demand_forecast(history_days=90, horizon_days=7, top_items=5):
    today = timezone.now().date()
    start_date = today - timedelta(days=max(7, history_days) - 1)
    end_date = today

    base_order_items = OrderItem.objects.exclude(order__status="CANCELLED").filter(
        order__created_at__date__gte=start_date,
        order__created_at__date__lte=end_date,
    )

    daily_totals_qs = (
        base_order_items
        .annotate(day=TruncDate("order__created_at"))
        .values("day")
        .annotate(total_qty=Sum("quantity"))
        .order_by("day")
    )
    daily_map = {row["day"]: float(row["total_qty"] or 0) for row in daily_totals_qs}
    date_labels, demand_series = _dense_series(daily_map, start_date, end_date)
    overall_forecast, overall_model = _forecast_values(demand_series, horizon_days)

    future_dates = [end_date + timedelta(days=index) for index in range(1, horizon_days + 1)]

    # Top menu items by historical quantity.
    menu_totals_qs = (
        base_order_items
        .values("menu_id", "menu__name")
        .annotate(total_qty=Sum("quantity"))
        .order_by("-total_qty")[:top_items]
    )

    menu_forecasts = []
    for row in menu_totals_qs:
        menu_id = row["menu_id"]
        menu_name = row["menu__name"]
        per_day_qs = (
            base_order_items
            .filter(menu_id=menu_id)
            .annotate(day=TruncDate("order__created_at"))
            .values("day")
            .annotate(total_qty=Sum("quantity"))
            .order_by("day")
        )
        per_day_map = {item["day"]: float(item["total_qty"] or 0) for item in per_day_qs}
        _, menu_series = _dense_series(per_day_map, start_date, end_date)
        forecast_values, model_used = _forecast_values(menu_series, horizon_days)

        menu_forecasts.append(
            {
                "menu_id": menu_id,
                "menu_name": menu_name,
                "model_used": model_used,
                "history_total_qty": float(row["total_qty"] or 0),
                "forecast_total_qty": round(sum(forecast_values), 2),
                "forecast": [
                    {"date": day.isoformat(), "predicted_qty": predicted}
                    for day, predicted in zip(future_dates, forecast_values)
                ],
            }
        )

    # Top toppings by historical quantity.
    base_toppings = OrderItemTopping.objects.exclude(order_item__order__status="CANCELLED").filter(
        order_item__order__created_at__date__gte=start_date,
        order_item__order__created_at__date__lte=end_date,
    )

    topping_totals_qs = (
        base_toppings
        .values("topping_name")
        .annotate(total_qty=Sum("quantity"))
        .order_by("-total_qty")[:top_items]
    )

    topping_forecasts = []
    for row in topping_totals_qs:
        topping_name = row["topping_name"]
        per_day_qs = (
            base_toppings
            .filter(topping_name=topping_name)
            .annotate(day=TruncDate("order_item__order__created_at"))
            .values("day")
            .annotate(total_qty=Sum("quantity"))
            .order_by("day")
        )
        per_day_map = {item["day"]: float(item["total_qty"] or 0) for item in per_day_qs}
        _, topping_series = _dense_series(per_day_map, start_date, end_date)
        forecast_values, model_used = _forecast_values(topping_series, horizon_days)

        topping_forecasts.append(
            {
                "topping_name": topping_name,
                "model_used": model_used,
                "history_total_qty": float(row["total_qty"] or 0),
                "forecast_total_qty": round(sum(forecast_values), 2),
                "forecast": [
                    {"date": day.isoformat(), "predicted_qty": predicted}
                    for day, predicted in zip(future_dates, forecast_values)
                ],
            }
        )

    return {
        "generated_at": timezone.now().isoformat(),
        "history_days": history_days,
        "horizon_days": horizon_days,
        "overall": {
            "model_used": overall_model,
            "history": [
                {"date": day.isoformat(), "demand_qty": qty}
                for day, qty in zip(date_labels, demand_series)
            ],
            "forecast": [
                {"date": day.isoformat(), "predicted_qty": predicted}
                for day, predicted in zip(future_dates, overall_forecast)
            ],
            "forecast_total_qty": round(sum(overall_forecast), 2),
        },
        "menu_item_forecasts": menu_forecasts,
        "topping_forecasts": topping_forecasts,
    }

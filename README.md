# MOS Burger System

This repository contains the MOS Burger full-stack project:
- `mos_product_frontend/most_product_frontend` - React + Vite frontend
- `mos_rest_api/mos_rest_api` - Django REST API backend

This README is created based on `FRONTEND_IMPLEMENTATION.md` and includes quick setup for the whole system.

## Tech Stack
- Frontend: React 19, Vite, Redux Toolkit, React Router, Axios, React-Bootstrap
- Backend: Django, Django REST Framework
- Database: MySQL/MariaDB (configured in backend)

## Main Features
- Authentication (Customer/Staff/Admin roles)
- Menu browsing and category filtering
- Cart management with Redux
- Checkout flow with order creation
- Staff order management and rider assignment views

## Project Structure
```text
MOS_Burger/
|- FRONTEND_IMPLEMENTATION.md
|- README.md
|- credentials.txt
|- mos_product_frontend/
|  |- most_product_frontend/
|     |- src/
|     |- package.json
|- mos_rest_api/
   |- mos_rest_api/
      |- manage.py
      |- orders/
      |- users/
      |- menu/
      |- bike/
      |- delivery/
```

## Run Backend
```bash
cd C:\Users\User\Desktop\MOS_Burger\mos_rest_api
.\venv\Scripts\Activate
cd .\mos_rest_api
python manage.py runserver
```

Backend URL: `http://localhost:8000`

## Run Frontend
```bash
cd C:\Users\User\Desktop\MOS_Burger\mos_product_frontend\most_product_frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Test Accounts
See `credentials.txt` for role-based login accounts.

## Notes
- Start backend first, then frontend.
- Ensure CORS and API base URL are aligned with `http://localhost:8000`.
- If schema changes were made, run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

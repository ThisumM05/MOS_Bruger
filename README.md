# MOS Burger System

A full-stack restaurant management platform with advanced AI/ML capabilities for demand forecasting, personalized recommendations, and conversational ordering. Built with React, Django, and real ARIMA time-series modeling.

This repository contains:
- `mos_product_frontend/most_product_frontend` - React + Vite frontend with Redux state management
- `mos_rest_api/mos_rest_api` - Django REST API backend with machine learning pipelines
- Database: MySQL/MariaDB

## Tech Stack
- **Frontend**: React 18+, Vite, Redux Toolkit, React Router v6, Axios, React-Bootstrap, Recharts
- **Backend**: Django 5.0, Django REST Framework, statsmodels (ARIMA), SimpleJWT
- **Database**: MySQL/MariaDB
- **Styling**: Bootstrap 5, Custom CSS animations

## 🎯 Core Features

### Authentication & Role-Based Access
- Customer accounts with order history and personalized recommendations
- Staff accounts for order management and menu curation
- Admin accounts with full analytics and inventory forecasting
- JWT-based token authentication with role-based route guards

### Customer-Facing Features
1. **Menu Browsing & Filtering**: Browse categories, search items, view detailed descriptions and pricing
2. **Shopping Cart**: Redux-managed cart with item quantity management and session persistence
3. **Checkout & Payments**: Multi-field checkout form with order status tracking
4. **AI-Powered Personalized Recommendations**: ML model suggests menu items based on order history using hybrid collaborative + content-based filtering
5. **Floating Chatbot Widget**: Natural language intent detection for:
   - Menu search ("show spicy burgers")
   - Offer discovery ("any active promotions?")
   - Quick ordering via text ("add chicken burger to cart")

### Staff Features
- Order management dashboard with real-time status updates
- Assign riders to orders with smart filtering (available bikes only)
- View assigned orders and performance metrics
- Menu and promotional offer management

### Admin Features
- **Comprehensive Analytics Dashboard**:
  - Real-time orders, revenue, customer count metrics
  - Staff performance comparison charts
  - Filterable order views (by status, staff, time period)
- **Demand & Inventory Forecasting** (ARIMA Time-Series):
  - 7-day demand predictions with confidence intervals
  - Top menu item and topping forecasts
  - Historical trend analysis with model selection (ARIMA or moving-average fallback)
- **User Management**: Full CRUD for customers, staff, and delivery riders
- **Bike/Delivery Management**: Assign bikes to riders, track availability

### Order Management
- Status tracking: Pending → Processing → Waiting for Rider → Completed
- Rider assignment with dynamic bike availability filtering
- Order item customization with toppings
- Historical order aggregation for ML training

## 🤖 AI/ML Features

### 1. Personalized Menu Recommendations
**What it does**: Shows a "Recommended for You" section on the customer home page.

**How it works**:
- Hybrid recommender combining:
  - **Collaborative Filtering**: Find similar customers from order history (cosine similarity)
  - **Content-Based**: Item tags match user's historical preferences (name, description, category)
  - **Popularity Boost**: Fallback for new users or sparse history
- Final score: 60% collaborative + 30% content + 10% popularity
- Excludes already-ordered items and out-of-stock menu items
- Endpoint: `GET /api/menu/menu/recommendations/?limit=8`

### 2. AI Chatbot Assistant
**What it does**: Floating chat widget that answers menu questions and takes text orders.

**Capabilities**:
- Natural language understanding for intents:
  - Greetings, offer discovery, menu recommendations
  - Keyword-based search (spicy, chicken, beef, dessert, drink)
  - "Add X to cart" command parsing and execution
- Displays suggested menu cards with instant add-to-cart
- Endpoint: `POST /api/menu/menu/chatbot/`

### 3. Demand & Inventory Forecasting (ARIMA)
**What it does**: Predicts weekly sales volume and top-selling items to guide inventory ordering.

**How it works**:
- Trains ARIMA(p,d,q) models on historical daily demand (120-day window default)
- Generates 7-day forecasts for:
  - Overall system demand
  - Top 5 menu items
  - Top 5 toppings
- Model selection: tries ARIMA(2,1,2), (1,1,1), (1,0,1) in order; falls back to moving-average if all fail
- Endpoint: `GET /api/orders/orders/demand-forecast/?history_days=120&horizon_days=7`
- Admin dashboard displays line chart, forecast summary, and ranked predictions

## Project Structure
```text
MOS_Burger/
├── FRONTEND_IMPLEMENTATION.md
├── README.md
├── credentials.txt
├── AI_ML_Features_Ideas.md
├── mos_product_frontend/
│  └── most_product_frontend/
│     ├── src/
│     │  ├── components/
│     │  │  ├── Header.jsx              # Navigation & cart
│     │  │  ├── ChatbotWidget.jsx       # Floating chat (AI feature)
│     │  │  └── admin/
│     │  │     └── AdminLayout.jsx      # Admin sidebar
│     │  ├── pages/
│     │  │  ├── Home.jsx                # With recommendations section
│     │  │  ├── Menu.jsx
│     │  │  ├── Cart.jsx
│     │  │  ├── Checkout.jsx
│     │  │  ├── MyOrders.jsx
│     │  │  ├── staff/
│     │  │  │  ├── StaffDashboard.jsx
│     │  │  │  ├── StaffOrders.jsx      # With rider assignment
│     │  │  │  └── ManageMenu.jsx
│     │  │  └── admin/
│     │  │     ├── AdminDashboard.jsx   # Analytics, forecasts
│     │  │     └── AdminUserManagement.jsx
│     │  ├── redux/
│     │  │  └── slices/
│     │  │     ├── userSlice.js         # Auth state
│     │  │     └── cartSlice.js         # Cart with qty increment
│     │  └── services/
│     │     └── api.js                  # API client with menuAPI.getRecommendations, askChatbot, etc.
│     ├── package.json
│     └── vite.config.js
│
└── mos_rest_api/
   ├── pyproject.toml                 # Dependencies: statsmodels, pandas==2.2.3
   ├── seed_historical_forecast_data.py # 220 historical orders for ARIMA training
   ├── venv/                          # Python virtual environment
   └── mos_rest_api/
      ├── manage.py
      ├── orders/
      │  ├── models.py                # Order, OrderItem, OrderItemTopping
      │  ├── views.py                 # OrderViewSet + demand_forecast action
      │  ├── forecasting.py           # ARIMA forecasting logic (NEW)
      │  ├── serializers.py           # BikerIdField custom field
      │  └── urls.py
      ├── menu/
      │  ├── models.py                # Menu, Category, Promotion
      │  ├── views.py                 # MenuViewSet + recommendations & chatbot actions (NEW)
      │  ├── serializers.py
      │  └── urls.py
      ├── users/
      │  ├── models.py                # User, Customer, Staff, Delivery
      │  ├── views.py                 # UserViewSet with login action
      │  ├── serializers.py           # UserSerializer with _resolve_bike()
      │  └── urls.py
      ├── bike/
      │  └── models.py
      ├── toppings/
      │  └── models.py                # Topping model for order customization
      └── settings.py                 # CORS, JWT, database config
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL/MariaDB 5.7+

### Backend Setup

1. **Navigate to backend folder**:
   ```bash
   cd C:\Users\User\Desktop\MOS_Burger\mos_rest_api
   ```

2. **Activate virtual environment**:
   ```bash
   .\venv\Scripts\Activate
   ```

3. **Install dependencies** (statsmodels and pandas already in venv):
   ```bash
   cd .\mos_rest_api
   pip install --upgrade pip
   ```

4. **Run migrations** (if fresh database):
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Start backend server**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

   Backend runs at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend folder**:
   ```bash
   cd C:\Users\User\Desktop\MOS_Burger\mos_product_frontend\most_product_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

   Frontend runs at: `http://localhost:5173`

### Database Seeding (Optional)

If you want to reset and reseed test data:
```bash
cd C:\Users\User\Desktop\MOS_Burger\mos_rest_api\mos_rest_api
python manage.py shell -c "exec(open('seed_historical_forecast_data.py').read())"
```

This creates:
- 220 historical orders (distributed across ~180 days)
- 547 order items
- 710 order item toppings
- Provides sufficient training data for ARIMA forecasting

## 📱 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | ethan.admin@mosburger.com | Password123! |
| Staff | sarah.staff@mosburger.com | Password123! |
| Customer | john.wick@gmail.com | Password123! |

Additional accounts created during data seeding are documented in the database.

## 🔗 API Endpoints

### Authentication
- `POST /api/users/users/login/` - User login (returns JWT token)
- `POST /api/users/` - User registration

### Menu & AI Features
- `GET /api/menu/menu/` - List all menu items
- `GET /api/menu/categories/` - List menu categories
- `GET /api/menu/menu/recommendations/` - **[AI]** Personalized recommendations (auth required)
- `POST /api/menu/menu/chatbot/` - **[AI]** Chatbot intent processing
- `GET /api/menu/promotions/` - Active promotions

### Orders
- `GET /api/orders/orders/` - List orders
- `POST /api/orders/orders/` - Create new order
- `PATCH /api/orders/orders/{id}/` - Update order (assign rider, etc.)
- `GET /api/orders/orders/demand-forecast/` - **[AI]** ARIMA demand forecast (admin)

### Users & Admin
- `GET /api/users/users/` - List all users (admin)
- `PATCH /api/users/users/{id}/` - Update user (admin)
- `GET /api/bike/bikes/` - List bikes

## 🛠️ Important Notes

1. **CORS Configuration**: Frontend `http://localhost:5173` and backend `http://localhost:8000` are pre-configured.
2. **Database**: Ensure MySQL is running and credentials in `settings.py` match your setup.
3. **JWT Tokens**: Stored in localStorage; auto-cleared on 401 responses.
4. **ARIMA Forecasting**: 
   - Requires minimum 20 historical data points for ARIMA training
   - Falls back to moving-average if insufficient variance/data
   - First-time run may show warnings about non-stationary/non-invertible parameters (normal for sparse data)
5. **Rider Assignment**: Only riders with assigned bikes and no active orders appear in dropdown.
6. **Admin Restrictions**: Admins cannot place orders; cart and menu add buttons are blocked.

## 📊 Performance Optimization

- Frontend code-splitting with React lazy loading and Suspense
- Redux middleware for optimized state updates
- API request caching where applicable
- Database query optimization with select_related() and prefetch_related()
- ARIMA forecasting with early termination on successful model fit

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find venv" | Ensure you're in `mos_rest_api` directory, not `MOS_Burger` root |
| CORS errors | Backend CORS settings allow `http://localhost:5173` |
| Import errors in backend | Run `pip install -r requirements.txt` (or reinstall statsmodels) |
| Forecasting not working | Ensure statsmodels (v0.14.5) and pandas (v2.2.3) are installed |
| ARIMA warnings at startup | Normal for sparse data; fallback is automatic |
| Admin dashboard showing no orders | Create test orders via customer account first |

## 📝 Future Enhancements

- Real-time order notifications (WebSockets)
- Delivery tracking with GPS integration
- Customer ratings & reviews with sentiment analysis
- Seasonal demand forecasting (Prophet)
- Dynamic pricing based on demand
- Multi-language support
- Mobile app (React Native)

## 👥 Contributors

- Initial system design and RBAC implementation
- AI/ML integration: personalized recommendations, chatbot, ARIMA forecasting
- Admin analytics dashboard
- Historical data seeding for ML training

## 📄 License

This project is for educational purposes.

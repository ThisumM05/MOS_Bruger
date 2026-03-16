import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense, lazy, useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WelcomeLoader from "./components/WelcomeLoader";
import BurgerLoader from "./components/BurgerLoader";
import "./App.css";

// Lazy load pages for code splitting and loading animation transition
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Offers = lazy(() => import("./pages/Offers"));
const MyOrders = lazy(() => import("./pages/MyOrders"));

// Staff Pages
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const ManageMenu = lazy(() => import("./pages/staff/ManageMenu"));
const StaffOrders = lazy(() => import("./pages/staff/StaffOrders"));
const ManageOffers = lazy(() => import("./pages/staff/ManageOffers"));

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Staff Route Wrapper
const StaffRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== "STAFF" && user?.role !== "ADMIN")
    return <Navigate to="/" />;

  return children;
};

function App() {
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for the Welcome Screen
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoad) {
    return <WelcomeLoader />;
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Suspense
            fallback={
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "60vh" }}
              >
                <BurgerLoader size="large" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/offers" element={<Offers />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff-dashboard"
                element={
                  <StaffRoute>
                    <StaffDashboard />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff-menu"
                element={
                  <StaffRoute>
                    <ManageMenu />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff-offers"
                element={
                  <StaffRoute>
                    <ManageOffers />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff-orders"
                element={
                  <StaffRoute>
                    <StaffOrders />
                  </StaffRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

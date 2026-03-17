import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import {
  FiGrid,
  FiUsers,
  FiEdit3,
  FiStar,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import { FaHamburger } from "react-icons/fa";

const navItems = [
  { to: "/admin-dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin-users", label: "Users & Bikes", icon: FiUsers },
  { to: "/admin-menu", label: "Manage Menu", icon: FiEdit3 },
  { to: "/admin-offers", label: "Manage Offers", icon: FiStar },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <aside
        className="bg-dark text-white d-flex flex-column p-4"
        style={{ width: "280px", minHeight: "100vh", position: "sticky", top: 0 }}
      >
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary">
          <div
            className="bg-danger text-white rounded p-2 me-3 d-flex align-items-center justify-content-center"
            style={{ width: "46px", height: "46px" }}
          >
            <FaHamburger size={22} />
          </div>
          <div>
            <div className="fw-bold fs-5">MOS Burger</div>
            <div className="small text-secondary">Admin Panel</div>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-3 bg-black bg-opacity-25 border border-secondary">
          <div className="d-flex align-items-center mb-2">
            <FiShield className="me-2 text-warning" />
            <span className="fw-semibold">{user?.username}</span>
          </div>
          <div className="small text-secondary">{user?.email}</div>
        </div>

        <nav className="d-flex flex-column gap-2 flex-grow-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-decoration-none d-flex align-items-center gap-3 px-3 py-3 rounded-3 ${
                  isActive ? "bg-danger text-white" : "text-light"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2 mt-4"
        >
          <FiLogOut />
          Logout
        </button>
      </aside>

      <div className="flex-grow-1 p-4 p-lg-5 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

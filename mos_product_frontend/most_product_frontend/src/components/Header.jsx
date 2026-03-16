import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiMenu,
  FiGift,
  FiMapPin,
  FiClipboard,
  FiGrid,
  FiEdit3,
  FiStar,
  FiList,
} from "react-icons/fi";
import { FaHamburger } from "react-icons/fa"; // Fallback icon
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="py-3 sticky-top shadow-sm">
      <Container>
        {/* Logo Section */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center me-5"
        >
          <div
            className="bg-danger text-white rounded p-1 me-2 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
          >
            {/* Using a simple icon or svg here would be better, using FaHamburger for now */}
            <FaHamburger size={24} />
          </div>
          <span
            className="fw-bold text-dark h4 mb-0"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            MOS Burger
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Center Navigation */}
          <Nav className="mx-auto align-items-center">
            {!isStaff ? (
              <>
                <Nav.Link as={Link} to="/menu" className="nav-social-tile">
                  <FiMenu /> Menu
                </Nav.Link>
                <Nav.Link as={Link} to="/offers" className="nav-social-tile">
                  <FiGift /> Offers
                </Nav.Link>
                {isAuthenticated && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/locations"
                      className="nav-social-tile"
                    >
                      <FiMapPin /> Locations
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/orders"
                      className="nav-social-tile"
                    >
                      <FiClipboard /> My Orders
                    </Nav.Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/staff-dashboard"
                  className="nav-social-tile admin-tile"
                >
                  <FiGrid /> Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/staff-menu"
                  className="nav-social-tile admin-tile"
                >
                  <FiEdit3 /> Manage Menu
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/staff-offers"
                  className="nav-social-tile admin-tile"
                >
                  <FiStar /> Manage Offers
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/staff-orders"
                  className="nav-social-tile admin-tile"
                >
                  <FiList /> All Orders
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Right Icons & Search */}
          <div className="d-flex align-items-center gap-4">
            {/* Search Bar - hidden for regular customers */}
          

            {/* Cart / Orders Icon */}
            {isAuthenticated && !isStaff && (
              <div
                className="position-relative cursor-pointer"
                onClick={() => navigate("/cart")}
                style={{ cursor: "pointer" }}
                title="Cart"
              >
                <div
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <FiShoppingBag size={20} className="text-dark" />
                </div>
                {cartCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle border border-light"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </div>
            )}

            {isStaff && (
              <div
                className="position-relative cursor-pointer"
                onClick={() => navigate("/staff-orders")}
                style={{ cursor: "pointer" }}
                title="View All Orders"
              >
                <div
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <FiShoppingBag size={20} className="text-dark" />
                </div>
              </div>
            )}

            {/* Profile / Logout */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                  title={user?.email}
                >
                  <span className="fw-bold small text-dark">
                    {user?.first_name
                      ? user.first_name[0]
                      : user?.email
                        ? user.email[0].toUpperCase()
                        : "U"}
                  </span>
                </div>
                <div
                  className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center cursor-pointer"
                  style={{ width: "40px", height: "40px", cursor: "pointer" }}
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </div>
              </div>
            ) : (
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center cursor-pointer"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => navigate("/login")}
                title="Login"
              >
                <FiUser size={20} className="text-dark" />
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

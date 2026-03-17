import { useState } from "react";
import { Dropdown, Badge, Button, Image } from "react-bootstrap";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../redux/slices/cartSlice";
import "./CartDropdown.css";

const CartDropdown = () => {
  const fallbackImage = `${import.meta.env.BASE_URL}image_1.jpg`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [showCart, setShowCart] = useState(false);

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const getItemTotalPrice = (item) => {
    const toppingsCost =
      item.toppings?.reduce((sum, t) => sum + t.extra_price * t.quantity, 0) ||
      0;
    return (item.base_price + toppingsCost) * item.quantity;
  };

  return (
    <Dropdown
      show={showCart}
      onToggle={(isOpen) => setShowCart(isOpen)}
      className="d-inline-block me-2"
      align="end"
    >
      <Dropdown.Toggle
        as="a"
        className="nav-link position-relative text-dark border-0 bg-transparent p-2"
        id="cart-dropdown"
        style={{ cursor: "pointer" }}
      >
        <FiShoppingCart size={24} />
        {cartItemCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle rounded-circle cart-badge-bounce"
            style={{ fontSize: "0.75rem", padding: "0.35em 0.6em" }}
          >
            {cartItemCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="cart-dropdown-menu p-0 m-0 border-0">
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center header-section">
          <h6 className="fw-bold m-0 text-uppercase font-heading text-dark">
            Your Cart
          </h6>
          <span className="badge bg-secondary rounded-pill font-body">
            {cartItemCount} Items
          </span>
        </div>

        <div className="cart-item-list">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <span className="d-block h2 mb-2">🛒</span>
              <p className="text-muted m-0 font-body">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center p-3 cart-item-row position-relative"
              >
                <Image
                  src={fallbackImage}
                  rounded
                  style={{ width: "56px", height: "56px", objectFit: "cover" }}
                  className="me-3 shadow-sm"
                />
                <div className="flex-grow-1">
                  <h6
                    className="m-0 fw-bold text-dark font-heading"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {item.name}
                  </h6>
                  {item.toppings && item.toppings.length > 0 && (
                    <div
                      className="text-muted small text-truncate"
                      style={{ maxWidth: "180px", fontSize: "0.75rem" }}
                    >
                      + {item.toppings.map((t) => t.name).join(", ")}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <small className="text-muted font-body">
                      {item.quantity} x $
                      {(getItemTotalPrice(item) / item.quantity).toFixed(2)}
                    </small>
                    <span
                      className="fw-bold text-danger text-end font-heading"
                      style={{ minWidth: "60px" }}
                    >
                      ${getItemTotalPrice(item).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="link"
                  className="text-danger p-0 ms-2 opacity-75 hover-opacity-100"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing dropdown
                    handleRemoveItem(item.id);
                  }}
                  title="Remove item"
                >
                  <FiTrash2 size={18} />
                </Button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-3 cart-total-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted font-body">Total:</span>
              <h5 className="fw-bold m-0 text-danger font-heading">
                ${totalAmount.toFixed(2)}
              </h5>
            </div>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setShowCart(false);
                  navigate("/checkout");
                }}
                className="rounded-pill font-heading fw-bold shadow-sm"
              >
                Confirm Order
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setShowCart(false);
                  navigate("/cart");
                }}
                className="rounded-pill font-heading"
              >
                View Bag
              </Button>
            </div>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CartDropdown;

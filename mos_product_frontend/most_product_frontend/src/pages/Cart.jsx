import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const tax = subtotal * 0.08;
  const deliveryFee = 3.0;
  const total = subtotal + tax + deliveryFee;

  const handleQtyChange = (item, change) => {
    if (item.qty + change > 0) {
      dispatch(addToCart({ ...item, qty: item.qty + change }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        {/* Breadcrumb replacement */}
        <div className="mb-4 text-muted small">
          <span className="cursor-pointer" onClick={() => navigate("/")}>
            Home
          </span>
          <span className="mx-2">›</span>
          <span className="fw-bold text-dark">Your Cart</span>
        </div>

        <h2 className="fw-bold mb-5 text-dark display-6">Your Cart</h2>

        <Row className="g-5">
          {/* Cart Items List */}
          <Col lg={8}>
            {cartItems.length === 0 ? (
              <Card className="border-0 shadow-sm p-5 text-center mb-4 rounded-4">
                <div className="mb-3 text-muted" style={{ fontSize: "3rem" }}>
                  🛒
                </div>
                <h4 className="text-muted mb-4">Your cart is empty</h4>
                <Button
                  variant="outline-danger"
                  className="px-4 py-2 rounded-pill mx-auto"
                  onClick={() => navigate("/menu")}
                >
                  Start Ordering
                </Button>
              </Card>
            ) : (
              cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden"
                >
                  <Card.Body className="d-flex align-items-center p-4">
                    <div
                      className="rounded-4 overflow-hidden me-4 flex-shrink-0 position-relative"
                      style={{ width: "120px", height: "120px" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="fw-bold mb-1 text-dark">
                            {item.name}
                          </h5>
                          <p className="text-muted small mb-0">
                            Extra Cheese, No Onions, Caramelized Onions
                          </p>
                        </div>
                        <h5 className="fw-bold text-danger text-end ms-3">
                          ${(item.price * item.qty).toFixed(2)}
                        </h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-end mt-3">
                        <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                          <Button
                            variant="link"
                            className="text-dark p-0 text-decoration-none"
                            onClick={() => handleQtyChange(item, -1)}
                            style={{ width: "24px" }}
                          >
                            <FiMinus size={14} />
                          </Button>
                          <span className="mx-3 fw-bold small text-dark user-select-none">
                            {item.qty}
                          </span>
                          <Button
                            variant="link"
                            className="text-dark p-0 text-decoration-none"
                            onClick={() => handleQtyChange(item, 1)}
                            style={{ width: "24px" }}
                          >
                            <FiPlus size={14} />
                          </Button>
                        </div>
                        <Button
                          variant="link"
                          className="text-muted text-decoration-none p-0 d-flex align-items-center small hover-danger"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          <FiTrash2 className="me-2" size={16} />{" "}
                          <span className="fw-semibold">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card
              className="border-0 shadow-sm rounded-4 p-4 bg-white sticky-top"
              style={{ top: "100px" }}
            >
              <h4 className="fw-bold mb-4 text-dark">Order Summary</h4>

              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-muted fs-6">Subtotal</span>
                <span className="fw-bold fs-6">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-muted fs-6">Tax (8%)</span>
                <span className="fw-bold fs-6">${tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 small">
                <span className="text-muted fs-6">Delivery Fee</span>
                <span className="fw-bold fs-6">${deliveryFee.toFixed(2)}</span>
              </div>

              <hr className="my-4 border-light-subtle" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold h5 mb-0 text-dark">Total</span>
                <span className="fw-bold h3 text-danger mb-0">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-muted mb-2">
                  Promo Code
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Enter code"
                    className="rounded-start-pill border-end-0 bg-white border shadow-none py-2"
                  />
                  <Button
                    variant="dark"
                    className="rounded-end-pill px-4 border"
                  >
                    Apply
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                variant="success"
                size="lg"
                className="w-100 rounded-pill fw-bold d-flex justify-content-center align-items-center py-3 shadow-sm hover-brightness"
                onClick={() => navigate("/checkout")}
                disabled={cartItems.length === 0}
              >
                <span className="me-2">Proceed to Checkout</span>
                <FiArrowRight />
              </Button>

              <p
                className="text-center text-muted mt-4 mb-3"
                style={{ fontSize: "0.7rem", lineHeight: "1.4" }}
              >
                By checking out, you agree to our <br />
                Terms of Service and Privacy Policy.
              </p>

              <div className="d-flex justify-content-center gap-4 opacity-25 mt-2">
                <div
                  className="bg-dark rounded"
                  style={{ width: "40px", height: "25px" }}
                ></div>
                <div
                  className="bg-dark rounded"
                  style={{ width: "40px", height: "25px" }}
                ></div>
                <div
                  className="bg-dark rounded"
                  style={{ width: "40px", height: "25px" }}
                ></div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;

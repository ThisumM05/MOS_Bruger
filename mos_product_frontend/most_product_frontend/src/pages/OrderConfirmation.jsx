import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { FiCheckCircle, FiHome } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Card
          className="border-0 shadow-sm rounded-4 text-center p-5 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <div className="mb-4">
            <FiCheckCircle size={80} className="text-success" />
          </div>
          <h2 className="fw-bold mb-3">Order Placed Successfully!</h2>
          <p className="text-muted mb-4">
            Thank you for your order. Your order ID is{" "}
            <span className="fw-bold text-dark">#{id || "12345"}</span>.
            <br />
            We have sent a confirmation email to your registered email address.
          </p>

          <div className="bg-light rounded-3 p-4 mb-4 text-start">
            <h6 className="fw-bold mb-3">Order Details</h6>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Status</span>
              <span className="badge bg-warning text-dark">Preparing</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Estimated Delivery</span>
              <span className="fw-bold">30-40 mins</span>
            </div>
          </div>

          <Button
            variant="danger"
            size="lg"
            className="rounded-pill px-5 fw-bold"
            onClick={() => navigate("/")}
          >
            <FiHome className="me-2" /> Back to Home
          </Button>
        </Card>
      </Container>
    </div>
  );
};

export default OrderConfirmation;

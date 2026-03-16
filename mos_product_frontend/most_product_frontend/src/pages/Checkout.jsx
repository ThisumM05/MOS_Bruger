import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, ProgressBar, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import { FiCheckCircle, FiLock, FiCreditCard, FiDollarSign, FiArrowLeft, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState("123 Burger Lane");
  const [city, setCity] = useState("Tokyo");
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusInfo, setStatusInfo] = useState({ success: true, message: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = 0; 
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      const orderPayload = {
         customer: user?.username || "guest",
         status: "PENDING",
         street_address: address,
         city: city,
         payment_method: paymentMethod.toUpperCase(),
         items: cartItems.map(item => ({
             menu: item.product_id || item.id,
             quantity: item.qty,
             toppings: (item.selectedToppings || []).map(t => ({
                 topping_name: t.name,
                 quantity: t.count,
                 extra_price: parseFloat(t.price)
             }))
         }))
      };

      await axios.post("http://localhost:8000/api/orders/orders/", orderPayload);
      
      setStatusInfo({ success: true, message: "Payment Successful! Your order has been placed." });
      setShowStatusModal(true);
      
      setTimeout(() => {
          setShowStatusModal(false);
          dispatch(clearCart());
          navigate("/my-orders");
      }, 2500);

    } catch (err) {
      console.error("Failed to place order", err);
      setStatusInfo({ success: false, message: "Error occurred while processing payment. Please try again." });
      setShowStatusModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center text-danger fw-bold cursor-pointer" onClick={() => navigate("/menu")} style={{ cursor: 'pointer' }}>
            <FiArrowLeft className="me-2" /> Back to Menu
          </div>
        </div>

        <div className="mb-5 text-center position-relative">
          <div className="d-flex justify-content-center align-items-center mb-4 text-uppercase fw-bold small tracking-wider position-relative" style={{ zIndex: 1 }}>
            <div className="text-danger mx-5 text-center"><div className="bg-white rounded px-2">SHIPPING</div></div>
            <div className="text-danger mx-5 text-center"><div className="bg-white rounded px-2">PAYMENT</div></div>
            <div className="text-secondary mx-5 text-center"><div className="bg-white rounded px-2">REVIEW</div></div>
          </div>
          <div className="progress position-absolute top-50 start-50 translate-middle-x bg-light" style={{ height: "4px", width: "600px", marginTop: "-14px", zIndex: 0 }}>
            <div className="progress-bar bg-danger" role="progressbar" style={{ width: "66%" }}></div>
            <div className="progress-bar bg-secondary opacity-25" role="progressbar" style={{ width: "34%" }}></div>
          </div>
          <p className="text-muted mt-4 small">Step 2 of 3: Secure Payment</p>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 mb-4 p-4 overflow-hidden">
              <h5 className="fw-bold mb-4 d-flex align-items-center text-dark">
                <span className="bg-danger rounded-circle p-1 me-3 d-flex align-items-center justify-content-center text-white" style={{ width: "24px", height: "24px", fontSize: "0.8rem" }}>
                  <span className="material-icons" style={{ fontSize: "12px" }}>location_on</span>
                </span>
                Delivery Address
              </h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">Street Address</Form.Label>
                  <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-3 shadow-none bg-light border-0 py-3" />
                </Form.Group>
                <Form.Group className="mb-3">
                   <Form.Label className="small text-muted fw-bold">City</Form.Label>
                   <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} className="rounded-3 shadow-none bg-light border-0 py-3" />
                </Form.Group>
              </Form>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center text-dark">
                <span className="bg-danger rounded-circle p-1 me-3 d-flex align-items-center justify-content-center text-white" style={{ width: "24px", height: "24px", fontSize: "0.8rem" }}>
                  <span className="material-icons" style={{ fontSize: "12px" }}>credit_card</span>
                </span>
                Payment Method
              </h5>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <div className={`p-4 rounded-4 border text-center cursor-pointer position-relative transition-all h-100 d-flex flex-column align-items-center justify-content-center ${paymentMethod === "card" ? "border-success bg-success-subtle" : "border-light bg-light"}`} onClick={() => setPaymentMethod("card")} style={{ cursor: "pointer", borderWidth: "2px" }}>
                    {paymentMethod === "card" && <FiCheckCircle className="position-absolute top-0 end-0 m-2 text-success bg-white rounded-circle" />}
                    <FiCreditCard size={32} className={`mb-3 ${paymentMethod === "card" ? "text-success" : "text-secondary"}`} />
                    <div className={`fw-bold small ${paymentMethod === "card" ? "text-success" : "text-secondary"}`}>Credit Card</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className={`p-4 rounded-4 border text-center cursor-pointer transition-all h-100 d-flex flex-column align-items-center justify-content-center ${paymentMethod === "cash" ? "border-success bg-success-subtle" : "border-light bg-light"}`} onClick={() => setPaymentMethod("cash")} style={{ cursor: "pointer", borderWidth: "2px" }}>
                    {paymentMethod === "cash" && <FiCheckCircle className="position-absolute top-0 end-0 m-2 text-success bg-white rounded-circle" />}
                    <FiDollarSign size={32} className={`mb-3 ${paymentMethod === "cash" ? "text-dark" : "text-secondary"}`} />
                    <div className={`fw-bold small ${paymentMethod === "cash" ? "text-dark" : "text-secondary"}`}>Cash on Delivery</div>
                  </div>
                </Col>
              </Row>

              {paymentMethod === "card" && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted fw-bold">Card Number</Form.Label>
                    <Form.Control type="text" defaultValue="4532 1234 5678 9012" className="rounded-3 shadow-none bg-light border-0 py-3" />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted fw-bold">Expiry Date</Form.Label>
                        <Form.Control type="text" defaultValue="12/26" className="rounded-3 shadow-none bg-light border-0 py-3" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted fw-bold">CVV</Form.Label>
                        <Form.Control type="text" defaultValue="123" className="rounded-3 shadow-none bg-light border-0 py-3" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "100px" }}>
              <h5 className="fw-bold mb-4 text-dark">Order Summary</h5>
              <div className="mb-4 d-flex flex-column gap-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center">
                    <div className="rounded overflow-hidden me-3 flex-shrink-0" style={{ width: "50px", height: "50px" }}>
                      <img src={item.image || item.image_url} alt="" className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0 small fw-bold">{item.name}</h6>
                      <small className="text-muted">x{item.qty}</small>
                    </div>
                    <div className="fw-bold small">${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Subtotal</span>
                  <span className="fw-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Delivery</span>
                  <span className="text-success fw-bold">Free</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-4">
                  <span className="fw-bold">Total</span>
                  <h4 className="fw-bold text-danger mb-0">${total.toFixed(2)}</h4>
                </div>
                <Button variant="danger" className="w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : <><FiLock className="me-2" /> Complete Order</>}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Payment Status Modal */}
      <Modal show={showStatusModal} onHide={() => !statusInfo.success && setShowStatusModal(false)} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center p-5">
           {statusInfo.success ? (
               <FiCheckCircle className="text-success mb-3" size={64} />
           ) : (
               <FiXCircle className="text-danger mb-3" size={64} />
           )}
           <h4 className="fw-bold mb-3">{statusInfo.success ? "Success!" : "Payment Failed"}</h4>
           <p className="text-muted mb-4">{statusInfo.message}</p>
           {!statusInfo.success && (
               <Button variant="danger" className="px-4" onClick={() => setShowStatusModal(false)}>
                   Try Again
               </Button>
           )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Checkout;
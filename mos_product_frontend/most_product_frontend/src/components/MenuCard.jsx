import { useState } from "react";
import { Card, Button, Badge, Row, Col, Modal } from "react-bootstrap";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import "./MenuCard.css";

const MenuCard = ({ item }) => {
  const fallbackImage = `${import.meta.env.BASE_URL}image_1.jpg`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShow(true);
  };

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const cartItem = {
      id: item.id,
      name: item.name,
      base_price: parseFloat(item.base_price),
      quantity: 1,
      toppings: [],
      image: item.image || fallbackImage,
    };

    dispatch(addItem(cartItem));
    handleClose();
  };

  return (
    <>
      <Card
        className={`h-100 border-0 shadow-sm menu-card-hover ${!item.is_available ? 'inactive-card' : ''}`}
        onClick={item.is_available ? handleShow : undefined}
        style={{ cursor: item.is_available ? "pointer" : "not-allowed", borderRadius: "16px", overflow: "hidden", opacity: item.is_available ? 1 : 0.6 }} 
      >
        <div
          className="overflow-hidden position-relative"
          style={{ height: "200px" }}
        >
          <Card.Img
            variant="top"
            src={fallbackImage}
            alt={item.name}
            className="h-100 w-100"
            style={{ objectFit: "cover", transition: "transform 0.5s ease", filter: item.is_available ? "none" : "grayscale(100%)" }}   
          />
        </div>
        <Card.Body className="d-flex flex-column p-4">
          <Row className="align-items-start mb-2">
            <Col>
              <Card.Title
                className="fw-bold mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.name}
              </Card.Title>
            </Col>
            {!item.is_available && (
              <Col xs="auto">
                <Badge bg="danger" className="rounded-pill">
                  Sold Out
                </Badge>
              </Col>
            )}
          </Row>

          <Card.Text
            className="text-muted mb-3 flex-grow-1 small"
            style={{ lineHeight: "1.5" }}
          >
            {item.description || "Delicious burger made with fresh ingredients"}
          </Card.Text>

          <Row className="align-items-center mt-auto">
            <Col>
              <h5 className="fw-bold mb-0" style={{ color: "var(--mos-red)" }}>
                ${parseFloat(item.base_price).toFixed(2)}
              </h5>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                disabled={!item.is_available}
                className="d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm"
              >
                <FiShoppingCart size={16} />
                Add
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        contentClassName="border-0 rounded-4 overflow-hidden shadow-lg"
        backdropClassName="blur-backdrop"
      >
        <Modal.Body className="p-0">
          <Row className="g-0">
            <Col md={6}>
              <img
                src={fallbackImage}
                alt={item.name}
                className="w-100 h-100"
                style={{ objectFit: "cover", minHeight: "350px" }}
              />
            </Col>
            <Col md={6}>
              <div className="p-4 d-flex flex-column h-100 position-relative">
                <Button
                  variant="light"
                  className="position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                  onClick={handleClose}
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "0",
                    zIndex: 10,
                  }}
                >
                  <FiX size={20} />
                </Button>

                <h2
                  className="fw-bold mb-2 font-heading"
                  style={{ color: "var(--text-main)" }}
                >
                  {item.name}
                </h2>

                {!item.is_available && (
                  <div className="mb-3">
                    <Badge bg="danger">Out of Stock</Badge>
                  </div>
                )}

                <div className="mb-4">
                  <span className="fw-bold fs-3 text-danger">
                    ${parseFloat(item.base_price).toFixed(2)}
                  </span>
                </div>

                <p
                  className="text-muted mb-4 flex-grow-1 font-body"
                  style={{ lineHeight: "1.6" }}
                >
                  {item.description ||
                    "Experience the taste of perfection with our signature burger, crafted with fresh, premium ingredients and our secret sauce."}
                </p>

                <div className="d-grid mt-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!item.is_available}
                    className="d-flex align-items-center justify-content-center gap-2 rounded-pill py-3"
                  >
                    <FiShoppingCart size={20} />
                    Add to Order
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MenuCard;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { FiSearch, FiShoppingCart, FiX, FiPlus, FiMinus } from "react-icons/fi";
import { FaHamburger, FaIceCream, FaCoffee, FaUtensils } from "react-icons/fa";
import { GiFrenchFries, GiBowlOfRice } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, topRes] = await Promise.all([
          axios.get("http://localhost:8000/api/menu/categories/"),
          axios.get("http://localhost:8000/api/toppings/toppings/"),
        ]);
        setCategories(catRes.data.value || catRes.data || []);
        if (catRes.data && catRes.data.length > 0) {
          setSelectedCategory(catRes.data[0]);
        }

        setToppings(topRes.data.value || topRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("burger")) return <FaHamburger />;
    if (lowerName.includes("rice")) return <GiBowlOfRice />;
    if (lowerName.includes("side") || lowerName.includes("frie"))
      return <GiFrenchFries />;
    if (lowerName.includes("drink") || lowerName.includes("beverage"))
      return <FaCoffee />;
    if (lowerName.includes("dessert") || lowerName.includes("sweet"))
      return <FaIceCream />;
    return <FaUtensils />;
  };

  const mapToppingIcon = (keyword) => {
    const map = {
      cheese: "🧀",
      bacon: "🥓",
      jalapeno: "🌶️",
      egg: "🍳",
      sauce: "🥫",
      spicy: "🔥",
      ice: "🧊",
      lemon: "🍋",
      boba: "🧋",
      chocolate: "🍫",
      strawberry: "🍓",
      sprinkles: "✨",
    };
    for (let key in map) {
      if (keyword && keyword.toLowerCase().includes(key)) return map[key];
    }
    return "✨";
  };

  const handleShowModal = (item, catId) => {
    if (user?.role === "ADMIN") {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setModalItem({ ...item, category_id: catId });
    setSelectedToppings({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalItem(null);
  };

  const handleToppingChange = (toppingId, increment) => {
    setSelectedToppings((prev) => {
      const current = prev[toppingId] || 0;
      const next = current + increment;
      if (next < 0) return prev;
      return { ...prev, [toppingId]: next };
    });
  };

  const calculateTotalPrice = () => {
    if (!modalItem) return 0;
    const base = parseFloat(modalItem.base_price || 0);
    const toppingsTotal = Object.entries(selectedToppings).reduce(
      (acc, [topId, count]) => {
        const toppingInfo = toppings.find((t) => t.id === parseInt(topId));
        return (
          acc + (toppingInfo ? parseFloat(toppingInfo.extra_price) * count : 0)
        );
      },
      0,
    );
    return base + toppingsTotal;
  };

  const handleAddToCart = () => {
    if (!modalItem) return;

    const itemToppings = Object.entries(selectedToppings)
      .filter(([id, count]) => count > 0)
      .map(([id, count]) => {
        const t = toppings.find((top) => top.id === parseInt(id));
        return { name: t.name, count, price: parseFloat(t.extra_price) };
      });

    const hasToppings = itemToppings.length > 0;
    const finalId = hasToppings
      ? `${modalItem.id}-${new Date().getTime()}`
      : modalItem.id;

    const cartItem = {
      ...modalItem,
      id: finalId, // allow multiple variations
      product_id: modalItem.id, // reference to original
      price: calculateTotalPrice(),
      base_price: parseFloat(modalItem.base_price || 0),
      qty: 1,
      selectedToppings: itemToppings,
    };

    dispatch(addToCart(cartItem));
    handleCloseModal();
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1625813527987-a64d2579893d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  ];

  let displayContent = [];
  if (searchQuery.trim() !== "") {
    displayContent = categories
      .map((cat) => {
        const matchedItems = cat.menus.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())),
        );
        return { ...cat, menus: matchedItems };
      })
      .filter((cat) => cat.menus.length > 0);
  } else if (selectedCategory) {
    const selected =
      categories.find((cat) => cat.id === selectedCategory.id) ||
      selectedCategory;
    displayContent = [selected];
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Search Header */}
      <div className="bg-white py-4 shadow-sm mb-5">
        <Container>
          <InputGroup
            className="border rounded-pill overflow-hidden bg-light"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <InputGroup.Text className="bg-light border-0 ps-4">
              <FiSearch className="text-muted" size={20} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Find your craving..."
              className="border-0 shadow-none bg-light py-3"
              style={{ fontSize: "1rem" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Container>
      </div>

      <Container>
        <Row>
          {/* Sidebar Categories */}
          <Col md={3} className="mb-4">
            <div
              className="sticky-top pt-2"
              style={{ top: "100px", zIndex: 10 }}
            >
              <h6 className="text-muted small fw-bold mb-3 px-3 tracking-widest">
                CATEGORIES
              </h6>
              <div className="d-flex flex-column gap-2">
                {categories.map((cat) => {
                  const isSelected =
                    selectedCategory?.id === cat.id && !searchQuery.trim();
                  return (
                    <div
                      key={cat.id}
                      className={`d-flex align-items-center px-4 py-3 rounded-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-danger text-white shadow-sm"
                          : "bg-transparent text-secondary hover-shadow hover-bg-light"
                      }`}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontWeight: isSelected ? "600" : "500",
                      }}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchQuery("");
                      }}
                    >
                      <span className="me-3 fs-5">
                        {getCategoryIcon(cat.name)}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>

          {/* Products Grid */}
          <Col md={9}>
            {displayContent.length === 0 ? (
              <Col xs={12} className="text-center py-5">
                <div className="mb-3 fs-1 text-muted">🍽️</div>
                <p className="text-muted fw-semibold">No items found.</p>
              </Col>
            ) : (
              displayContent.map((categoryGroup) => (
                <div key={categoryGroup.id} className="mb-5">
                  <h4 className="fw-bold mb-4">{categoryGroup.name}</h4>
                  <Row className="gy-4">
                    {categoryGroup.menus.map((item) => {
                      const itemImage =
                        item.image ||
                        item.image_url ||
                        defaultImages[item.id % defaultImages.length];
                      return (
                        <Col key={item.id} md={4} sm={6}>
                          <Card
                            className="border-0 shadow-sm h-100 position-relative hover-shadow transition-all"
                            style={{
                              borderRadius: "15px",
                              overflow: "hidden",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleShowModal(
                                { ...item, image: itemImage },
                                categoryGroup.id,
                              )
                            }
                          >
                            {/* Price Tag Circle */}
                            <div
                              className="position-absolute bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                              style={{
                                width: "55px",
                                height: "55px",
                                top: "15px",
                                left: "15px",
                                zIndex: 2,
                                fontSize: "0.9rem",
                              }}
                            >
                              $
                              {parseFloat(
                                item.base_price || item.price || 0,
                              ).toFixed(2)}
                            </div>

                            {/* Top Image Section */}
                            <div
                              className="w-100 bg-light position-relative"
                              style={{ height: "220px" }}
                            >
                              <img
                                src={itemImage}
                                alt={item.name}
                                className="w-100 h-100"
                                style={{ objectFit: "cover" }}
                              />
                            </div>

                            {/* Bottom Details Section */}
                            <Card.Body className="d-flex flex-column p-4 bg-white">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Card.Title className="fw-bold fs-5 mb-0 text-dark">
                                  {item.name}
                                </Card.Title>
                              </div>
                              <Card.Text className="text-muted small mb-4 flex-grow-1">
                                {item.description}
                              </Card.Text>
                              <div className="mt-auto d-flex justify-content-end">
                                <Button
                                  variant="danger"
                                  className="rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm hover-zoom"
                                  style={{ width: "45px", height: "45px" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowModal(
                                      { ...item, image: itemImage },
                                      categoryGroup.id,
                                    );
                                  }}
                                >
                                  <FiPlus size={24} className="text-white" />
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              ))
            )}
          </Col>
        </Row>
      </Container>

      {/* Item & Toppings Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        contentClassName="border-0 overflow-hidden"
        style={{ borderRadius: "20px" }}
      >
        {modalItem && (
          <Row className="g-0 h-100 flex-column flex-md-row">
            {/* Left Box: Full Image */}
            <Col
              md={5}
              className="position-relative p-0 bg-light"
              style={{ minHeight: "220px" }}
            >
              <Button
                variant="light"
                className="position-absolute rounded-circle shadow-sm"
                onClick={handleCloseModal}
                style={{
                  top: "15px",
                  left: "15px",
                  width: "35px",
                  height: "35px",
                  zIndex: 10,
                  padding: 0,
                }}
              >
                <FiX size={18} />
              </Button>
              <img
                src={modalItem.image}
                alt={modalItem.name}
                className="w-100 h-100 position-absolute"
                style={{ objectFit: "cover", top: 0, left: 0 }}
              />
            </Col>

            {/* Right Box: Toppings & Details */}
            <Col md={7} className="d-flex flex-column bg-white">
              <div className="p-4 d-flex flex-column h-100 position-relative">
                <Button
                  variant="light"
                  className="position-absolute d-none d-md-flex align-items-center justify-content-center rounded-circle shadow-sm"
                  onClick={handleCloseModal}
                  style={{
                    top: "15px",
                    right: "15px",
                    width: "35px",
                    height: "35px",
                    padding: 0,
                  }}
                >
                  <FiX size={18} />
                </Button>

                <h4
                  className="fw-bold mb-1 text-dark pe-4"
                  style={{ fontFamily: "inherit" }}
                >
                  {modalItem.name}
                </h4>
                <h5 className="text-danger fw-bold mb-2">
                  $
                  {parseFloat(
                    modalItem.base_price || modalItem.price || 0,
                  ).toFixed(2)}
                </h5>
                <p
                  className="text-muted mb-3 small"
                  style={{ fontSize: "0.85rem" }}
                >
                  {modalItem.description}
                </p>

                <h6
                  className="fw-bold mb-2 text-dark text-uppercase tracking-widest"
                  style={{ fontSize: "0.75rem" }}
                >
                  Customize & Add Toppings
                </h6>

                <div
                  className="flex-grow-1 overflow-auto pe-2 mb-3"
                  style={{ maxHeight: "180px" }}
                >
                  {toppings.filter((t) => t.category === modalItem.category_id)
                    .length === 0 ? (
                    <div className="text-muted p-3 bg-light rounded text-center">
                      No extra toppings available for this item.
                    </div>
                  ) : (
                    toppings
                      .filter((t) => t.category === modalItem.category_id)
                      .map((topping) => (
                        <div
                          key={topping.id}
                          className="d-flex align-items-center justify-content-between p-3 mb-2 bg-light rounded-3 transition-all"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="fs-3 bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                              style={{ width: "50px", height: "50px" }}
                            >
                              {mapToppingIcon(topping.image_url)}
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-0 text-dark">
                                {topping.name}
                              </h6>
                              <small className="text-danger fw-bold">
                                +${parseFloat(topping.extra_price).toFixed(2)}
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center bg-white rounded-pill px-2 py-1 shadow-sm border">
                            <Button
                              variant="link"
                              className="p-1 px-2 text-dark text-decoration-none"
                              onClick={() =>
                                handleToppingChange(topping.id, -1)
                              }
                              disabled={!selectedToppings[topping.id]}
                            >
                              <FiMinus size={16} />
                            </Button>
                            <span
                              className="fw-bold px-2"
                              style={{ minWidth: "25px", textAlign: "center" }}
                            >
                              {selectedToppings[topping.id] || 0}
                            </span>
                            <Button
                              variant="link"
                              className="p-1 px-2 text-dark text-decoration-none"
                              onClick={() => handleToppingChange(topping.id, 1)}
                            >
                              <FiPlus size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block text-uppercase fw-bold">
                      Total Price
                    </small>
                    <h3 className="fw-bold text-dark mb-0">
                      ${calculateTotalPrice().toFixed(2)}
                    </h3>
                  </div>
                  <Button
                    variant="danger"
                    size="lg"
                    className="rounded-pill px-5 d-flex align-items-center gap-2 fw-bold shadow hover-zoom"
                    onClick={handleAddToCart}
                    style={{ borderRadius: "2rem" }}
                  >
                    <FiShoppingCart /> Add{" "}
                    {calculateTotalPrice() >
                    parseFloat(modalItem.base_price || modalItem.price || 0)
                      ? "Custom"
                      : ""}{" "}
                    Order
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default Menu;

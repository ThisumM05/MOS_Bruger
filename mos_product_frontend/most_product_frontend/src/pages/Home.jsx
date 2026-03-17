import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import {
  FaHamburger,
  FaIceCream,
  FaCoffee,
  FaUtensils,
  FaLeaf,
  FaFire,
} from "react-icons/fa";
import { GiFrenchFries, GiChefToque } from "react-icons/gi";
import { FiShoppingCart, FiChevronRight, FiTag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { menuAPI } from "../services/api";
import axios from "axios";

const Home = () => {
  const publicBase = import.meta.env.BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [promotion, setPromotion] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Fetch Categories, Featured Items, and Promotions
    const fetchData = async () => {
      try {
        const [categoriesRes, menuRes, promoRes] = await Promise.all([
          axios.get("http://localhost:8000/api/menu/categories/"),
          axios.get("http://localhost:8000/api/menu/menu/"),
          axios.get("http://localhost:8000/api/menu/promotions/"),
        ]);

        setCategories(categoriesRes.data);

        if (promoRes.data && promoRes.data.length > 0) {
          setPromotion(promoRes.data[0]);
        }

        // Map API data to our frontend shape for features
        const defaultImages = [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ];

        const fetchedItems = menuRes.data.slice(0, 3).map((item, index) => ({
          ...item,
          price: item.base_price ? parseFloat(item.base_price) : 0,
          image: defaultImages[index] || defaultImages[0],
        }));
        setFeaturedItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }, // Trigger when 20% of the element is visible
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "CUSTOMER") {
      setRecommendedItems([]);
      return;
    }

    const fetchRecommendations = async () => {
      setRecommendationsLoading(true);
      try {
        const response = await menuAPI.getRecommendations(6);
        const defaultImages = [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "https://images.unsplash.com/photo-1625813527987-a64d2579893d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ];

        const normalized = (response.data || []).map((item, index) => ({
          ...item,
          price: parseFloat(item.base_price || 0),
          image: defaultImages[index % defaultImages.length],
        }));

        setRecommendedItems(normalized);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendedItems([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [isAuthenticated, user?.role]);

  const getCategoryIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("burger"))
      return <FaHamburger size={30} className="text-danger" />;
    if (lowerName.includes("side") || lowerName.includes("frie"))
      return <GiFrenchFries size={30} className="text-danger" />;
    if (lowerName.includes("drink") || lowerName.includes("beverage"))
      return <FaCoffee size={30} className="text-danger" />;
    if (lowerName.includes("dessert") || lowerName.includes("sweet"))
      return <FaIceCream size={30} className="text-danger" />;
    return <FaUtensils size={30} className="text-danger" />;
  };

  return (
    <div className="bg-light pb-5">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="position-relative w-100 d-flex align-items-center"
        style={{
          minHeight: "650px",
          backgroundColor: "#fafafa",
          overflow: "hidden",
        }}
      >
        <Container className="position-relative z-1 py-5">
          <Row className="align-items-center">
            {/* Text Overlay Left */}
            <Col
              lg={6}
              className="text-center text-lg-start mb-5 mb-lg-0 pe-lg-5"
              style={{
                transform: isHeroVisible
                  ? "translateX(0)"
                  : "translateX(-150px)",
                opacity: isHeroVisible ? 1 : 0,
                transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
              }}
            >
              <h1
                className="display-2 fw-bold mb-3 text-dark"
                style={{
                  fontFamily: "'TAN Buster', 'Georgia', serif",
                }}
              >
                Experience The <br />
                <span className="text-danger">Perfect</span> Bite
              </h1>
              <p className="lead text-muted mb-4 fs-4">
                Freshly made to order with premium ingredients and our signature
                secret sauces. Taste the authentic difference today.
              </p>

              <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                <Button
                  variant="danger"
                  size="lg"
                  className="rounded-pill px-5 py-3 fw-bold shadow"
                  onClick={() => navigate("/menu")}
                >
                  Order Now
                </Button>
                <Button
                  variant="outline-danger"
                  size="lg"
                  className="rounded-pill px-5 py-3 fw-bold bg-white hover-zoom"
                  style={{ borderWidth: "2px" }}
                  onClick={() => navigate("/menu")}
                >
                  View Menu
                </Button>
              </div>
            </Col>

            {/* Right Side Image & Circle */}
            <Col
              lg={6}
              className="position-relative d-flex justify-content-center align-items-center"
              style={{
                minHeight: "500px",
                transform: isHeroVisible
                  ? "translateX(0)"
                  : "translateX(150px)",
                opacity: isHeroVisible ? 1 : 0,
                transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.4s",
              }}
            >
              {/* Background Circle */}
              <div
                className="position-absolute rounded-circle shadow-sm"
                style={{
                  width: "450px",
                  height: "450px",
                  backgroundColor: "#ffdb58", // Bright yellow circle
                  top: "50%",
                  left: "50%",
                  transform: "translate(-20%, -50%)", // Off-center it visually
                  zIndex: 0,
                }}
              ></div>

              {/* Main Burger Image */}
              <img
                src={`${publicBase}burger_header.png`}
                alt="MOS Featured Burger"
                className="position-relative z-1 img-fluid"
                style={{
                  transform: "scale(1.2) translateX(-15%)", // Scales up and shifts out of the dead center of the circle
                  filter: "drop-shadow(15px 25px 20px rgba(0,0,0,0.35))", // Adds the requested shadow
                  maxWidth: "500px",
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Category Icons Bar */}
      <Container className="my-5">
        <div
          className="bg-white rounded-5 shadow-sm p-4 d-flex justify-content-around flex-wrap gap-4"
          style={{ overflow: "visible" }}
        >
          {categories.length > 0 ? (
            categories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="text-center cursor-pointer category-card-wrapper"
                onClick={() => navigate(`/menu?category=${category.id}`)}
              >
                <div
                  className="rounded-circle border border-2 border-danger bg-light d-flex align-items-center justify-content-center mx-auto mb-2 position-relative"
                  style={{ width: "70px", height: "70px", zIndex: 2 }}
                >
                  {getCategoryIcon(category.name)}
                </div>
                <h6
                  className="fw-bold mb-0 text-danger position-relative"
                  style={{ zIndex: 2 }}
                >
                  {category.name}
                </h6>

                {/* Hover Floating Images */}
                <div className="floating-images-container">
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="latest item 1"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="latest item 2"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="latest item 3"
                    className="floating-img"
                  />
                </div>
              </div>
            ))
          ) : (
            // Fallback skeleton if API fails or is empty
            <>
              <div
                className="text-center cursor-pointer category-card-wrapper"
                onClick={() => navigate("/menu")}
              >
                <div
                  className="rounded-circle border border-2 border-danger d-flex align-items-center justify-content-center mx-auto mb-2 bg-light position-relative"
                  style={{ width: "70px", height: "70px", zIndex: 2 }}
                >
                  <FaHamburger size={30} className="text-danger" />
                </div>
                <h6
                  className="fw-bold mb-0 text-danger position-relative"
                  style={{ zIndex: 2 }}
                >
                  Burgers
                </h6>
                <div className="floating-images-container">
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="burger 1"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="burger 2"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="burger 3"
                    className="floating-img"
                  />
                </div>
              </div>
              <div
                className="text-center cursor-pointer category-card-wrapper"
                onClick={() => navigate("/menu")}
              >
                <div
                  className="rounded-circle border border-2 border-danger d-flex align-items-center justify-content-center mx-auto mb-2 bg-light position-relative"
                  style={{ width: "70px", height: "70px", zIndex: 2 }}
                >
                  <GiFrenchFries size={30} className="text-danger" />
                </div>
                <h6
                  className="fw-bold mb-0 text-danger position-relative"
                  style={{ zIndex: 2 }}
                >
                  Sides
                </h6>
                <div className="floating-images-container">
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="side 1"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="side 2"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="side 3"
                    className="floating-img"
                  />
                </div>
              </div>
              <div
                className="text-center cursor-pointer category-card-wrapper"
                onClick={() => navigate("/menu")}
              >
                <div
                  className="rounded-circle border border-2 border-danger d-flex align-items-center justify-content-center mx-auto mb-2 bg-light position-relative"
                  style={{ width: "70px", height: "70px", zIndex: 2 }}
                >
                  <FaCoffee size={30} className="text-danger" />
                </div>
                <h6
                  className="fw-bold mb-0 text-danger position-relative"
                  style={{ zIndex: 2 }}
                >
                  Drinks
                </h6>
                <div className="floating-images-container">
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="drink 1"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="drink 2"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="drink 3"
                    className="floating-img"
                  />
                </div>
              </div>
              <div
                className="text-center cursor-pointer category-card-wrapper"
                onClick={() => navigate("/menu")}
              >
                <div
                  className="rounded-circle border border-2 border-danger d-flex align-items-center justify-content-center mx-auto mb-2 bg-light position-relative"
                  style={{ width: "70px", height: "70px", zIndex: 2 }}
                >
                  <FaIceCream size={30} className="text-danger" />
                </div>
                <h6
                  className="fw-bold mb-0 text-danger position-relative"
                  style={{ zIndex: 2 }}
                >
                  Desserts
                </h6>
                <div className="floating-images-container">
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="dessert 1"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="dessert 2"
                    className="floating-img"
                  />
                  <img
                    src={`${publicBase}burger_header.png`}
                    alt="dessert 3"
                    className="floating-img"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
      {/* Why Choose Us Section */}
      <div className="bg-white py-5 mb-5 shadow-sm">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">
              Why Choose <span className="text-danger">MOS Burger</span>?
            </h2>
            <p className="text-muted">
              Our commitment to quality in every bite
            </p>
          </div>
          <Row className="text-center g-4">
            <Col md={4} className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3 shadow-sm"
                style={{ width: "90px", height: "90px" }}
              >
                <FaLeaf size={40} className="text-success" />
              </div>
              <h5 className="fw-bold">Fresh Ingredients</h5>
              <p className="text-muted px-3">
                We source the highest quality local produce daily to ensure
                maximum crispness and flavor.
              </p>
            </Col>
            <Col md={4} className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3 shadow-sm"
                style={{ width: "90px", height: "90px" }}
              >
                <GiChefToque size={40} className="text-danger" />
              </div>
              <h5 className="fw-bold">Made to Order</h5>
              <p className="text-muted px-3">
                After you order, we start cooking. You never get a burger that's
                been sitting around.
              </p>
            </Col>
            <Col md={4} className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3 shadow-sm"
                style={{ width: "90px", height: "90px" }}
              >
                <FaFire size={40} className="text-warning" />
              </div>
              <h5 className="fw-bold">Hot & Delicious</h5>
              <p className="text-muted px-3">
                Straight from our grill to your tray, guaranteeing that perfect
                mouth-watering temperature.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Promotional Banner */}
      {promotion && (
        <Container className="mb-5">
          <div
            className="rounded-4 p-4 p-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between shadow position-relative overflow-hidden"
            style={{ backgroundColor: promotion.background_color || "#ffdb58" }}
          >
            {/* Visual background element */}
            <div
              className="position-absolute rounded-circle bg-white opacity-25"
              style={{
                width: "200px",
                height: "200px",
                top: "-50px",
                right: "-50px",
              }}
            ></div>

            <div className="text-center text-md-start mb-3 mb-md-0 position-relative z-1">
              <h2
                className="fw-bold text-dark mb-2 display-6"
                style={{ fontFamily: "'TAN Buster', serif" }}
              >
                {promotion.title}
              </h2>
              <p className="text-dark fs-5 mb-0">{promotion.description}</p>
            </div>

            {promotion.promo_code && (
              <div
                className="bg-white p-3 p-md-4 rounded-3 text-center shadow-sm position-relative z-1 d-flex flex-column align-items-center justify-content-center"
                style={{ minWidth: "220px" }}
              >
                <small className="text-uppercase fw-bold text-muted mb-1">
                  <FiTag className="me-1" /> Use Code
                </small>
                <h3 className="fw-bold text-danger mb-0 letter-spacing-1">
                  {promotion.promo_code}
                </h3>
              </div>
            )}
          </div>
        </Container>
      )}

      {isAuthenticated && user?.role === "CUSTOMER" && (
        <Container className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Recommended for You</h2>
              <small className="text-muted">
                Personalized picks based on your order history
              </small>
            </div>
            <Button
              variant="link"
              className="text-danger fw-bold text-decoration-none d-flex align-items-center"
              onClick={() => navigate("/menu")}
            >
              Explore Menu <FiChevronRight />
            </Button>
          </div>

          {recommendationsLoading ? (
            <div className="text-muted">Loading recommendations...</div>
          ) : recommendedItems.length === 0 ? (
            <div className="text-muted">
              No personalized recommendations yet. Place a few orders to improve
              suggestions.
            </div>
          ) : (
            <Row className="gy-4">
              {recommendedItems.map((item) => (
                <Col key={item.id} md={4} className="mb-4">
                  <Card
                    className="border-0 shadow-sm h-100 position-relative hover-shadow transition-all"
                    style={{
                      borderRadius: "15px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/menu")}
                  >
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
                      ${item.price.toFixed(2)}
                    </div>

                    <div
                      className="w-100 bg-light position-relative"
                      style={{ height: "220px" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <Card.Body className="d-flex flex-column p-4 bg-white">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="fw-bold fs-5 mb-0 text-dark">
                          {item.name}
                        </Card.Title>
                      </div>

                      <Card.Text className="text-muted small mb-2">
                        {item.description}
                      </Card.Text>

                      <Badge
                        bg="warning"
                        text="dark"
                        className="align-self-start mb-3"
                      >
                        {item.reason || "Recommended"}
                      </Badge>

                      <div className="mt-auto d-flex justify-content-end">
                        <Button
                          variant="danger"
                          className="rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                          style={{ width: "45px", height: "45px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addToCart({ ...item, qty: 1 }));
                          }}
                        >
                          <FiShoppingCart size={20} className="text-white" />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      )}

      {/* Featured Items */}
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Featured Items</h2>
          <Button
            variant="link"
            className="text-danger fw-bold text-decoration-none d-flex align-items-center"
            onClick={() => navigate("/menu")}
          >
            View All <FiChevronRight />
          </Button>
        </div>

        <Row className="gy-4">
          {featuredItems.map((item) => (
            <Col key={item.id} md={4} className="mb-4">
              <Card
                className="border-0 shadow-sm h-100 position-relative hover-shadow transition-all"
                style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/menu")}
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
                  ${item.price.toFixed(2)}
                </div>

                {/* Top Image Section */}
                <div
                  className="w-100 bg-light position-relative"
                  style={{ height: "220px" }}
                >
                  <img
                    src={item.image}
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
                      className="rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "45px", height: "45px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart({ ...item, qty: 1 }));
                      }}
                    >
                      <FiShoppingCart size={20} className="text-white" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;

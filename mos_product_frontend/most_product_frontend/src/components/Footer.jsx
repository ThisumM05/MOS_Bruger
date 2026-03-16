import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaHamburger } from "react-icons/fa";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";
import { SiRss } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-white pt-5 pb-3 border-top mt-auto">
      <Container>
        <Row className="gy-4 mb-5">
          {/* Brand Column */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center mb-3">
              <FaHamburger className="text-danger me-2" size={24} />
              <span className="fw-bold h5 mb-0 text-dark">MOS Burger</span>
            </div>
            <p className="text-muted small mb-4" style={{ maxWidth: "300px" }}>
              Bringing the authentic taste of Japan to your neighborhood since
              1972. Freshness and quality in every bite.
            </p>
            <div className="d-flex gap-2">
              <div
                className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}
              >
                <FiFacebook size={16} className="text-muted" />
              </div>
              <div
                className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}
              >
                <FiTwitter size={16} className="text-muted" />
              </div>
              <div
                className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}
              >
                <FiInstagram size={16} className="text-muted" />
              </div>
            </div>
          </Col>

          {/* Quick Links Column */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3 text-dark">Quick Links</h6>
            <ul className="list-unstyled text-muted small px-0">
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none text-muted">
                  Our Story
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/nutrition"
                  className="text-decoration-none text-muted"
                >
                  Nutrition Info
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/franchise"
                  className="text-decoration-none text-muted"
                >
                  Franchise
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none text-muted">
                  Contact Us
                </Link>
              </li>
            </ul>
          </Col>

          {/* Support Column */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3 text-dark">Support</h6>
            <ul className="list-unstyled text-muted small px-0">
              <li className="mb-2">
                <Link to="/help" className="text-decoration-none text-muted">
                  Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-decoration-none text-muted">
                  Terms of Service
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-decoration-none text-muted">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/delivery-faq"
                  className="text-decoration-none text-muted"
                >
                  Delivery FAQ
                </Link>
              </li>
            </ul>
          </Col>

          {/* Empty Column for spacing or News letter if needed later */}
          <Col lg={4} md={6}>
            {/* Placeholder for future expansion */}
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center pt-4 border-top">
          <p className="text-muted small mb-0">
            © 2024 MOS Burger. All rights reserved.
          </p>
          <div className="d-flex gap-2">
            <div
              className="bg-light rounded p-1"
              style={{ width: "24px", height: "24px" }}
            ></div>
            <div
              className="bg-light rounded p-1"
              style={{ width: "24px", height: "24px" }}
            ></div>
            <div
              className="bg-light rounded p-1"
              style={{ width: "24px", height: "24px" }}
            ></div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

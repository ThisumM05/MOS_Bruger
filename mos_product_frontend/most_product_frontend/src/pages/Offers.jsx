import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/menu/promotions/",
        );
        setOffers(response.data.value || response.data || []);
      } catch (error) {
        console.error("Error fetching offers", error);
      }
    };
    fetchOffers();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Special Offers</h2>
      <Row>
        {offers.map((offer) => (
          <Col md={4} key={offer.id} className="mb-4">
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                backgroundColor: offer.background_color || "#ffdb58",
                color: "#fff",
              }}
            >
              <Card.Body>
                <Card.Title className="fw-bold mb-3">{offer.title}</Card.Title>
                <Card.Text style={{ fontSize: "1.1rem" }}>
                  {offer.description}
                </Card.Text>
                {offer.promo_code && (
                  <div className="mt-4">
                    <Badge bg="light" text="dark" className="p-2 fs-6">
                      Use Code: {offer.promo_code}
                    </Badge>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
        {offers.length === 0 && (
          <Col>
            <p className="text-muted">
              No active offers at the moment. Check back later!
            </p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Offers;

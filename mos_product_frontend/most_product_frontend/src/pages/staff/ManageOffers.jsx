import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
} from "react-bootstrap";
import { FiPlus, FiTrash2, FiEdit, FiPower } from "react-icons/fi";
import axios from "axios";

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    promo_code: "",
    background_color: "#d82b2b",
  });

  const fetchOffers = async () => {
    try {
      // By default the model filters on is_active=True? Let's check viewset.
      // If we need all, maybe we added it. But for now using the standard endpoint.
      const res = await axios.get("http://localhost:8000/api/menu/promotions/");
      setOffers(res.data.value || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/menu/promotions/", newOffer);
      setShowModal(false);
      setNewOffer({
        title: "",
        description: "",
        promo_code: "",
        background_color: "#d82b2b",
      });
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Delete this promotion?")) {
        await axios.delete(`http://localhost:8000/api/menu/promotions/${id}/`);
        fetchOffers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Offers</h2>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <FiPlus /> New Offer
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table hover responsive className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Code</th>
                <th>Color</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td className="fw-bold">{offer.title}</td>
                  <td>{offer.description}</td>
                  <td>
                    <Badge bg="dark">{offer.promo_code}</Badge>
                  </td>
                  <td>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: offer.background_color,
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                      }}
                    ></div>
                  </td>
                  <td>
                    <Badge bg="success">Active</Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(offer.id)}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleCreate}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                value={newOffer.title}
                onChange={(e) =>
                  setNewOffer({ ...newOffer, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newOffer.description}
                onChange={(e) =>
                  setNewOffer({ ...newOffer, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Promo Code (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={newOffer.promo_code}
                onChange={(e) =>
                  setNewOffer({ ...newOffer, promo_code: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Theme Color</Form.Label>
              <Form.Control
                type="color"
                value={newOffer.background_color}
                onChange={(e) =>
                  setNewOffer({ ...newOffer, background_color: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Create Offer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageOffers;

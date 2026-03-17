import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchOrdersAndRiders = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8000/api/orders/orders/"),
        axios.get("http://localhost:8000/api/users/users/"),
      ]);
      const data = ordersRes.data.value || ordersRes.data || [];
      const usersData = usersRes.data.value || usersRes.data || [];
      setOrders(data);
      setRiders(usersData.filter((u) => u.role === "DELIVERY"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdersAndRiders();
  }, []);

  const getRiderBikeId = (rider) => rider?.profile?.bike || null;

  const isOrderActiveForRider = (order) => {
    return !["COMPLETED", "CANCELLED", "DELIVERED"].includes(order.status);
  };

  const getBusyBikeIds = () => {
    return new Set(
      orders
        .filter((order) => order.assigned_biker && isOrderActiveForRider(order))
        .map((order) => order.assigned_biker),
    );
  };

  const getAvailableRiders = () => {
    const busyBikeIds = getBusyBikeIds();
    const currentlyAssignedBike = selectedOrder?.assigned_biker || null;

    return riders.filter((rider) => {
      const bikeId = getRiderBikeId(rider);
      if (!bikeId) return false;
      if (currentlyAssignedBike && bikeId === currentlyAssignedBike)
        return true;
      return !busyBikeIds.has(bikeId);
    });
  };

  const handleClaimOrder = async (orderId) => {
    try {
      await axios.patch(`http://localhost:8000/api/orders/orders/${orderId}/`, {
        assigned_staff: user?.id || null,
        status: "PROCESSING",
      });
      fetchOrdersAndRiders();
    } catch (err) {
      console.error("Failed to claim order:", err);
    }
  };

  const handleAssignRiderClick = (order) => {
    setSelectedOrder(order);
    const currentRider = riders.find(
      (r) => getRiderBikeId(r) === order.assigned_biker,
    );
    setSelectedRider(currentRider?.id || "");
    setShowModal(true);
  };

  const submitAssignRider = async () => {
    if (!selectedOrder || !selectedRider) return;
    try {
      await axios.patch(
        `http://localhost:8000/api/orders/orders/${selectedOrder.id}/`,
        {
          assigned_biker: parseInt(selectedRider),
          status: "WAITING_FOR_RIDER",
        },
      );
      setShowModal(false);
      fetchOrdersAndRiders();
    } catch (err) {
      console.error("Failed to assign rider:", err);
      alert("Error assigning rider");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "success";
      case "PENDING":
        return "secondary";
      case "PROCESSING":
        return "info";
      case "WAITING_FOR_RIDER":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">All Orders Management</h2>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table hover responsive className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Rider</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isMyOrder =
                  order.assigned_staff === user?.id ||
                  (user?.username && order.assigned_staff === user?.username);
                const assignedRiderObj = riders.find(
                  (r) => getRiderBikeId(r) === order.assigned_biker,
                );
                return (
                  <tr
                    key={order.id}
                    style={{
                      backgroundColor: isMyOrder ? "#fffdf5" : "transparent",
                    }}
                  >
                    <td className="fw-bold">#{order.id}</td>
                    <td>{order.customer || order.email || "Guest"}</td>
                    <td>
                      {order.street_address
                        ? `${order.street_address}, ${order.city}`
                        : "-"}
                    </td>
                    <td>
                      $
                      {parseFloat(
                        order.total_amount || order.total_price || 0,
                      ).toFixed(2)}
                    </td>
                    <td>
                      <Badge
                        bg={getStatusBadge(order.status)}
                        text={
                          ["WAITING_FOR_RIDER", "PENDING"].includes(
                            order.status,
                          )
                            ? "dark"
                            : "light"
                        }
                      >
                        {order.status || "UNKNOWN"}
                      </Badge>
                    </td>
                    <td>
                      {order.assigned_staff ? (
                        isMyOrder ? (
                          <Badge bg="danger">Me</Badge>
                        ) : (
                          <span className="text-muted">
                            Staff #{order.assigned_staff}
                          </span>
                        )
                      ) : (
                        <span className="text-muted fst-italic">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      {assignedRiderObj ? (
                        <span className="text-success fw-bold">
                          {assignedRiderObj.username}
                        </span>
                      ) : (
                        <span className="text-muted">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {!order.assigned_staff && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleClaimOrder(order.id)}
                          >
                            Claim
                          </Button>
                        )}
                        {!order.assigned_biker &&
                          order.status !== "COMPLETED" &&
                          order.status !== "DELIVERED" && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleAssignRiderClick(order)}
                            >
                              Assign Rider
                            </Button>
                          )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No orders available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Rider to Order #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Rider</Form.Label>
            <Form.Select
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
            >
              <option value="">Select a rider...</option>
              {getAvailableRiders().map((r) => (
                <option key={r.id} value={r.id}>
                  {r.username} (ID: {r.id})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submitAssignRider}
            disabled={!selectedRider}
          >
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffOrders;

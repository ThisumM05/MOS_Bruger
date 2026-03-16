import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/orders/orders/"
        );
        const allOrders = response.data.value || response.data || [];

        // Filter out orders exclusively for this logged in user
        const myOrders = allOrders.filter(
          (order) => order.customer === user?.username || order.email === user?.email
        );
        setOrders(myOrders);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    if (user?.username || user?.email) {
      fetchOrders();
    }
  }, [user]);

  const viewOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  return (
    <Container className="py-5" style={{ minHeight: "60vh" }}>
      <h2 className="mb-4">My Orders</h2>
      <div className="bg-white rounded shadow-sm border p-4">
        {orders.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">
            You have no past orders.
          </p>
        ) : (
          <Table hover responsive className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>    
                  <td>${parseFloat(order.total_amount || order.total_price || 0).toFixed(2)}</td>
                  <td>
                    <Badge
                      bg={
                        order.status === "DELIVERED" || order.status === "COMPLETED" ? "success" : "warning"
                      } 
                      text="dark"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => viewOrder(order.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default MyOrders;
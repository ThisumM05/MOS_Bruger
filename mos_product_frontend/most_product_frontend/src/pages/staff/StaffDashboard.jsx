import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  Modal
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { FiUsers, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrdersHandled: 0,
    totalRevenue: 0,
    waitingOrders: [],
    customersServed: 0,
  });
  const [chartData, setChartData] = useState([]);
  
  const [riders, setRiders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8000/api/orders/orders/"),
        axios.get("http://localhost:8000/api/users/users/")
      ]);
      const allOrders = ordersRes.data.value || ordersRes.data || [];
      const usersData = usersRes.data.value || usersRes.data || [];
      
      setRiders(usersData.filter(u => u.role === "DELIVERY"));

      // Filter orders for this staff
      const staffOrders = allOrders.filter(
        (o) => o.assigned_staff === user?.id || o.assigned_staff === user?.username
      );

      const revenue = staffOrders.reduce(
        (sum, order) => sum + parseFloat(order.total_price || order.total_amount || 0),
        0,
      );

      const uniqueCustomers = new Set(staffOrders.map(o => o.email || o.customer)).size;

      const waiting = allOrders.filter(
        (o) => o.status === "WAITING_FOR_RIDER" || o.status === "PENDING" || !o.assigned_staff || !o.assigned_biker
      ).filter(o => o.status !== "COMPLETED" && o.status !== "DELIVERED");

      setStats({
        totalOrdersHandled: staffOrders.length,
        totalRevenue: revenue,
        waitingOrders: waiting,
        customersServed: uniqueCustomers
      });

      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const chart = [
        { name: "Mon", orders: 2, revenue: 45 },
        { name: "Tue", orders: 4, revenue: 80 },
        { name: "Wed", orders: 3, revenue: 55 },
        { name: "Thu", orders: 6, revenue: 120 },
        { name: "Fri", orders: 5, revenue: 110 },
        { name: "Sat", orders: 8, revenue: 160 },
        { name: "Sun", orders: 7, revenue: 140 }
      ];

      const todayIndex = chart.findIndex(d => d.name === today);
      if (todayIndex !== -1) {
           chart[todayIndex] = { name: today + " (Today)", orders: staffOrders.length, revenue: revenue };
      } else {
           chart[3] = { name: today + " (Today)", orders: staffOrders.length, revenue: revenue };
      }

      setChartData(chart);
    } catch (error) {
      console.error("Error loading dashboard data", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleAssignRiderClick = (order) => {
    setSelectedOrder(order);
    setSelectedRider(order.assigned_biker || "");
    setShowModal(true);
  };

  const submitAssignRider = async () => {
    if (!selectedOrder || !selectedRider) return;
    try {
      await axios.patch(`http://localhost:8000/api/orders/orders/${selectedOrder.id}/`, {
        assigned_biker: parseInt(selectedRider),
        status: "WAITING_FOR_RIDER",
        assigned_staff: user?.id || selectedOrder.assigned_staff || null
      });
      setShowModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to assign rider:", err);
      alert("Error assigning rider");
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Staff Dashboard</h2>
        <h5 className="text-muted">Welcome, {user?.username}</h5>
      </div>

      <Row className="mb-5">
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-danger text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3 p-3 bg-white bg-opacity-25 rounded-circle">
                <FiShoppingBag size={24} />
              </div>
              <div>
                <h6 className="mb-1">Orders Handled</h6>
                <h3 className="mb-0">{stats.totalOrdersHandled}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3 p-3 bg-white bg-opacity-25 rounded-circle">
                <FiDollarSign size={24} />
              </div>
              <div>
                <h6 className="mb-1">Revenue Generated</h6>
                <h3 className="mb-0">${stats.totalRevenue.toFixed(2)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 bg-warning text-dark">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3 p-3 bg-white bg-opacity-25 rounded-circle">
                <FiUsers size={24} />
              </div>
              <div>
                <h6 className="mb-1">Customers Served</h6>
                <h3 className="mb-0">{stats.customersServed || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0 mb-4 p-3">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Weekly Orders Overview</h5>
            </Card.Header>
            <Card.Body style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    name="Total Orders"
                    fill="#d82b2b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    name="Revenue ($)"
                    fill="#28a745"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Needs Assignment (Notifications)</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Current Rider</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.waitingOrders.map((order, idx) => {
                    const assignedRiderObj = riders.find(r => r.id === order.assigned_biker);
                    return (
                    <tr key={idx}>
                      <td className="fw-bold">#{order.id}</td>
                      <td>{order.customer || order.email || "Guest"}</td>
                      <td>${parseFloat(order.total_amount || order.total_price || 0).toFixed(2)}</td>
                      <td>
                        <Badge bg={["WAITING_FOR_RIDER", "PENDING"].includes(order.status) ? "warning" : "info"} text="dark">
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                         {assignedRiderObj ? <span className="text-success fw-bold">{assignedRiderObj.username}</span> : <span className="text-muted">Unassigned</span>}
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleAssignRiderClick(order)}
                        >
                          {order.assigned_biker ? "Change Biker" : "Assign Biker"}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="ms-2"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  )})}
                  {stats.waitingOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No pending orders.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Rider to Order #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Free Rider</Form.Label>
            <Form.Select value={selectedRider} onChange={(e) => setSelectedRider(e.target.value)}>
              <option value="">Select a rider...</option>
              {riders.map(r => (
                <option key={r.id} value={r.id}>{r.username} (ID: {r.id})</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={submitAssignRider} disabled={!selectedRider}>Assign</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default StaffDashboard;
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table, Badge } from "react-bootstrap";
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [filters, setFilters] = useState({
    status: "ALL",
    staffId: "ALL",
    period: "ALL",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, forecastRes] = await Promise.all([
          axios.get("http://localhost:8000/api/orders/orders/"),
          axios.get("http://localhost:8000/api/users/users/"),
          axios.get("http://localhost:8000/api/orders/orders/demand-forecast/?history_days=120&horizon_days=7"),
        ]);
        setOrders(ordersRes.data.value || ordersRes.data || []);
        setUsers(usersRes.data.value || usersRes.data || []);
        setForecastData(forecastRes.data || null);
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
      }
    };

    fetchData();
  }, []);

  const staffUsers = users.filter((user) => user.role === "STAFF");

  const isWithinPeriod = (order) => {
    if (filters.period === "ALL") return true;
    const createdAt = new Date(order.created_at);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (filters.period === "TODAY") return diffDays < 1;
    if (filters.period === "WEEK") return diffDays <= 7;
    if (filters.period === "MONTH") return diffDays <= 30;
    return true;
  };

  const filteredOrders = orders.filter((order) => {
    if (filters.status !== "ALL" && order.status !== filters.status) return false;
    if (filters.staffId !== "ALL" && String(order.assigned_staff) !== filters.staffId) return false;
    return isWithinPeriod(order);
  });

  const totalOrdersHandled = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + parseFloat(order.total_amount || order.total_price || 0),
    0,
  );
  const totalCustomersServed = new Set(
    filteredOrders.map((order) => order.customer || order.email || `guest-${order.id}`),
  ).size;

  const staffRows = staffUsers.map((staff) => {
    const handledOrders = filteredOrders.filter((order) => order.assigned_staff === staff.id);
    const revenue = handledOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || order.total_price || 0),
      0,
    );

    return {
      id: staff.id,
      name: `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || staff.username,
      email: staff.email,
      ordersHandled: handledOrders.length,
      revenue,
      customers: new Set(
        handledOrders.map((order) => order.customer || order.email || `guest-${order.id}`),
      ).size,
      orderIds: handledOrders.map((order) => `#${order.id}`).join(", ") || "-",
    };
  });

  const chartData = staffRows.map((row) => ({
    name: row.name,
    orders: row.ordersHandled,
    revenue: Number(row.revenue.toFixed(2)),
  }));

  const demandForecastChart = (forecastData?.overall?.forecast || []).map((point) => ({
    date: point.date,
    predicted: point.predicted_qty,
  }));

  const topMenuForecastRows = (forecastData?.menu_item_forecasts || []).map((entry) => ({
    name: entry.menu_name,
    predictedTotal: entry.forecast_total_qty,
    modelUsed: entry.model_used,
  }));

  const topToppingForecastRows = (forecastData?.topping_forecasts || []).map((entry) => ({
    name: entry.topping_name,
    predictedTotal: entry.forecast_total_qty,
    modelUsed: entry.model_used,
  }));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">Overview of staff performance, orders, and revenue.</p>
        </div>
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="ALL">All statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="WAITING_FOR_RIDER">Waiting for Rider</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Staff Member</Form.Label>
                <Form.Select value={filters.staffId} onChange={(e) => setFilters((prev) => ({ ...prev, staffId: e.target.value }))}>
                  <option value="ALL">All staff</option>
                  {staffUsers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {`${staff.first_name || ""} ${staff.last_name || ""}`.trim() || staff.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Period</Form.Label>
                <Form.Select value={filters.period} onChange={(e) => setFilters((prev) => ({ ...prev, period: e.target.value }))}>
                  <option value="ALL">All time</option>
                  <option value="TODAY">Today</option>
                  <option value="WEEK">Last 7 days</option>
                  <option value="MONTH">Last 30 days</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-danger text-white h-100">
            <Card.Body className="d-flex align-items-center gap-3">
              <FiShoppingBag size={28} />
              <div>
                <div className="small text-white-50">Total Orders Handled</div>
                <h3 className="mb-0">{totalOrdersHandled}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-success text-white h-100">
            <Card.Body className="d-flex align-items-center gap-3">
              <FiDollarSign size={28} />
              <div>
                <div className="small text-white-50">Revenue Generated</div>
                <h3 className="mb-0">${totalRevenue.toFixed(2)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-warning h-100">
            <Card.Body className="d-flex align-items-center gap-3">
              <FiUsers size={28} />
              <div>
                <div className="small text-muted">Total Customers Served</div>
                <h3 className="mb-0">{totalCustomersServed}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0">Orders and Revenue by Staff</h5>
        </Card.Header>
        <Card.Body style={{ height: "360px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#d82b2b" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#198754" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 py-3 d-flex align-items-center gap-2">
              <FiTrendingUp />
              <h5 className="mb-0">7-Day Demand Forecast (ARIMA)</h5>
            </Card.Header>
            <Card.Body style={{ height: "320px" }}>
              {demandForecastChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demandForecastChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="predicted" name="Predicted Qty" stroke="#d82b2b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted">Not enough forecast data yet.</div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Forecast Summary</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-2 text-muted small">Model Used</p>
              <h6 className="mb-3">{forecastData?.overall?.model_used || "N/A"}</h6>
              <p className="mb-2 text-muted small">Predicted Total Demand (Next 7 Days)</p>
              <h3 className="mb-3 text-danger">{forecastData?.overall?.forecast_total_qty || 0}</h3>
              <p className="mb-2 text-muted small">History Window</p>
              <h6 className="mb-0">{forecastData?.history_days || 0} days</h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Top Menu Item Forecast</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Item</th>
                    <th>Predicted Qty (7d)</th>
                    <th>Model</th>
                  </tr>
                </thead>
                <tbody>
                  {topMenuForecastRows.map((row) => (
                    <tr key={`menu-forecast-${row.name}`}>
                      <td>{row.name}</td>
                      <td>{row.predictedTotal}</td>
                      <td className="text-muted small">{row.modelUsed}</td>
                    </tr>
                  ))}
                  {topMenuForecastRows.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-3 text-muted">No menu forecast data.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Top Topping Forecast</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Topping</th>
                    <th>Predicted Qty (7d)</th>
                    <th>Model</th>
                  </tr>
                </thead>
                <tbody>
                  {topToppingForecastRows.map((row) => (
                    <tr key={`topping-forecast-${row.name}`}>
                      <td>{row.name}</td>
                      <td>{row.predictedTotal}</td>
                      <td className="text-muted small">{row.modelUsed}</td>
                    </tr>
                  ))}
                  {topToppingForecastRows.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-3 text-muted">No topping forecast data.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0">Staff Performance Details</h5>
        </Card.Header>
        <Card.Body>
          <Table hover responsive className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Staff Member</th>
                <th>Email</th>
                <th>Orders Handled</th>
                <th>Revenue</th>
                <th>Customers Served</th>
                <th>Handled Orders</th>
              </tr>
            </thead>
            <tbody>
              {staffRows.map((row) => (
                <tr key={row.id}>
                  <td className="fw-semibold">{row.name}</td>
                  <td>{row.email}</td>
                  <td><Badge bg="danger">{row.ordersHandled}</Badge></td>
                  <td>${row.revenue.toFixed(2)}</td>
                  <td>{row.customers}</td>
                  <td className="text-muted small">{row.orderIds}</td>
                </tr>
              ))}
              {staffRows.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No staff records found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;

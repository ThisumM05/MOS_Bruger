import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const emptyUserForm = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "CUSTOMER",
  phone: "",
  address: "",
  license_number: "",
  bike: "",
};

const emptyBikeForm = {
  brand: "",
  model_name: "",
  price_per_hour: "",
  is_available: true,
};

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBikeModal, setShowBikeModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingBike, setEditingBike] = useState(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [bikeForm, setBikeForm] = useState(emptyBikeForm);

  const fetchData = async () => {
    try {
      const [usersRes, bikesRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:8000/api/users/users/"),
        axios.get("http://localhost:8000/api/bike/bikes/"),
        axios.get("http://localhost:8000/api/orders/orders/"),
      ]);
      setUsers(usersRes.data.value || usersRes.data || []);
      setBikes(bikesRes.data.value || bikesRes.data || []);
      setOrders(ordersRes.data.value || ordersRes.data || []);
    } catch (error) {
      console.error("Failed to load admin management data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getActiveBikeIds = () => {
    return new Set(
      orders
        .filter(
          (order) =>
            order.assigned_biker &&
            !["COMPLETED", "CANCELLED", "DELIVERED"].includes(order.status),
        )
        .map((order) => order.assigned_biker),
    );
  };

  const getRiderStatus = (user) => {
    const bikeId = user?.profile?.bike;
    if (!bikeId) return "No Bike";
    return getActiveBikeIds().has(bikeId) ? "On Ride" : "Free";
  };

  const getAvailableBikes = () => {
    const assignedBikeIds = new Set(
      users
        .filter((user) => user.role === "DELIVERY" && user.profile?.bike)
        .map((user) => user.profile.bike),
    );

    return bikes.filter((bike) => {
      if (editingUser?.profile?.bike === bike.id) return true;
      return !assignedBikeIds.has(bike.id);
    });
  };

  const openUserModal = (user = null) => {
    setEditingUser(user);
    setUserForm(
      user
        ? {
            username: user.username || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            password: "",
            role: user.role || "CUSTOMER",
            phone: user.phone || "",
            address: user.address || "",
            license_number: user.profile?.license_number || "",
            bike: user.profile?.bike || "",
          }
        : emptyUserForm,
    );
    setShowUserModal(true);
  };

  const openBikeModal = (bike = null) => {
    setEditingBike(bike);
    setBikeForm(
      bike
        ? {
            brand: bike.brand || "",
            model_name: bike.model_name || "",
            price_per_hour: bike.price_per_hour || "",
            is_available: bike.is_available,
          }
        : emptyBikeForm,
    );
    setShowBikeModal(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    const payload = {
      username: userForm.username,
      first_name: userForm.first_name,
      last_name: userForm.last_name,
      email: userForm.email,
      role: userForm.role,
      phone: userForm.phone,
      address: userForm.address,
    };

    if (userForm.password) payload.password = userForm.password;
    if (userForm.role === "DELIVERY") {
      payload.profile = {
        license_number: userForm.license_number,
        bike: userForm.bike || null,
      };
    }

    try {
      if (editingUser) {
        await axios.patch(
          `http://localhost:8000/api/users/users/${editingUser.id}/`,
          payload,
        );
      } else {
        await axios.post("http://localhost:8000/api/users/users/", payload);
      }
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm(emptyUserForm);
      fetchData();
    } catch (error) {
      console.error("Failed to save user", error);
      alert("Failed to save user.");
    }
  };

  const saveBike = async (e) => {
    e.preventDefault();
    const payload = {
      brand: bikeForm.brand,
      model_name: bikeForm.model_name,
      price_per_hour: parseFloat(bikeForm.price_per_hour || 0),
      is_available: bikeForm.is_available,
    };

    try {
      if (editingBike) {
        await axios.patch(
          `http://localhost:8000/api/bike/bikes/${editingBike.id}/`,
          payload,
        );
      } else {
        await axios.post("http://localhost:8000/api/bike/bikes/", payload);
      }
      setShowBikeModal(false);
      setEditingBike(null);
      setBikeForm(emptyBikeForm);
      fetchData();
    } catch (error) {
      console.error("Failed to save bike", error);
      alert("Failed to save bike.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/users/users/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user.");
    }
  };

  const deleteBike = async (id) => {
    if (!window.confirm("Delete this bike?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/bike/bikes/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete bike", error);
      alert("Failed to delete bike.");
    }
  };

  const filteredUsers = users.filter(
    (user) => roleFilter === "ALL" || user.role === roleFilter,
  );

  const counts = {
    customers: users.filter((user) => user.role === "CUSTOMER").length,
    staff: users.filter((user) => user.role === "STAFF").length,
    riders: users.filter((user) => user.role === "DELIVERY").length,
    bikes: bikes.length,
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">User Management</h2>
          <p className="text-muted mb-0">
            Manage registered customers, staff, riders, bikes, and bike
            assignments.
          </p>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="small text-muted">Customers</div>
              <h3 className="mb-0">{counts.customers}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="small text-muted">Staff</div>
              <h3 className="mb-0">{counts.staff}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="small text-muted">Riders</div>
              <h3 className="mb-0">{counts.riders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="small text-muted">Bikes</div>
              <h3 className="mb-0">{counts.bikes}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <div className="btn-group">
            <Button
              variant={activeTab === "users" ? "danger" : "outline-danger"}
              onClick={() => setActiveTab("users")}
            >
              Users
            </Button>
            <Button
              variant={activeTab === "bikes" ? "danger" : "outline-danger"}
              onClick={() => setActiveTab("bikes")}
            >
              Bikes
            </Button>
          </div>

          {activeTab === "users" ? (
            <div className="d-flex gap-2">
              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All roles</option>
                <option value="CUSTOMER">Customers</option>
                <option value="STAFF">Staff</option>
                <option value="DELIVERY">Riders</option>
                <option value="ADMIN">Admins</option>
              </Form.Select>
              <Button variant="danger" onClick={() => openUserModal()}>
                <FiPlus className="me-2" />
                Add User
              </Button>
            </div>
          ) : (
            <Button variant="danger" onClick={() => openBikeModal()}>
              <FiPlus className="me-2" />
              Add Bike
            </Button>
          )}
        </Card.Body>
      </Card>

      {activeTab === "users" ? (
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table hover responsive className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Bike</th>
                  <th>Rider Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                        "-"}
                    </td>
                    <td className="fw-semibold">{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge
                        bg={
                          user.role === "DELIVERY"
                            ? "warning"
                            : user.role === "STAFF"
                              ? "info"
                              : user.role === "ADMIN"
                                ? "dark"
                                : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      {user.role === "DELIVERY"
                        ? user.profile?.bike || "Unassigned"
                        : "-"}
                    </td>
                    <td>
                      {user.role === "DELIVERY" ? (
                        <Badge
                          bg={
                            getRiderStatus(user) === "Free"
                              ? "success"
                              : getRiderStatus(user) === "On Ride"
                                ? "danger"
                                : "secondary"
                          }
                        >
                          {getRiderStatus(user)}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => openUserModal(user)}
                        >
                          <FiEdit2 />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table hover responsive className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Price / Hour</th>
                  <th>Availability</th>
                  <th>Assigned Rider</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => {
                  const assignedRider = users.find(
                    (user) =>
                      user.role === "DELIVERY" &&
                      user.profile?.bike === bike.id,
                  );
                  return (
                    <tr key={bike.id}>
                      <td>{bike.brand}</td>
                      <td className="fw-semibold">{bike.model_name}</td>
                      <td>
                        ${parseFloat(bike.price_per_hour || 0).toFixed(2)}
                      </td>
                      <td>
                        <Badge bg={bike.is_available ? "success" : "secondary"}>
                          {bike.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </td>
                      <td>
                        {assignedRider ? assignedRider.username : "Unassigned"}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openBikeModal(bike)}
                          >
                            <FiEdit2 />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteBike(bike.id)}
                          >
                            <FiTrash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {bikes.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No bikes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Form onSubmit={saveUser}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingUser ? "Update User" : "Add User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    value={userForm.username}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, role: e.target.value }))
                    }
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="STAFF">Staff</option>
                    <option value="DELIVERY">Rider</option>
                    <option value="ADMIN">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    value={userForm.first_name}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    value={userForm.last_name}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    {editingUser
                      ? "Password (leave blank to keep current)"
                      : "Password"}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    value={userForm.address}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              {userForm.role === "DELIVERY" && (
                <>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>License Number</Form.Label>
                      <Form.Control
                        value={userForm.license_number}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            license_number: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Assign Bike</Form.Label>
                      <Form.Select
                        value={userForm.bike}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            bike: e.target.value,
                          }))
                        }
                      >
                        <option value="">No bike</option>
                        {getAvailableBikes().map((bike) => (
                          <option key={bike.id} value={bike.id}>
                            {bike.brand} {bike.model_name} (#{bike.id})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Save User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showBikeModal} onHide={() => setShowBikeModal(false)}>
        <Form onSubmit={saveBike}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingBike ? "Update Bike" : "Add Bike"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    required
                    value={bikeForm.brand}
                    onChange={(e) =>
                      setBikeForm((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    required
                    value={bikeForm.model_name}
                    onChange={(e) =>
                      setBikeForm((prev) => ({
                        ...prev,
                        model_name: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price per Hour</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    step="0.01"
                    value={bikeForm.price_per_hour}
                    onChange={(e) =>
                      setBikeForm((prev) => ({
                        ...prev,
                        price_per_hour: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Availability</Form.Label>
                  <Form.Select
                    value={bikeForm.is_available ? "YES" : "NO"}
                    onChange={(e) =>
                      setBikeForm((prev) => ({
                        ...prev,
                        is_available: e.target.value === "YES",
                      }))
                    }
                  >
                    <option value="YES">Available</option>
                    <option value="NO">Unavailable</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBikeModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Save Bike
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;

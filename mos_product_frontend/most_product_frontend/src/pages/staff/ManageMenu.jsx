import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, Modal } from "react-bootstrap";
import { FiEdit2, FiTrash2, FiPlus, FiPower, FiImage, FiSave, FiX } from "react-icons/fi";
import { FaHamburger, FaIceCream, FaCoffee, FaUtensils } from "react-icons/fa";
import { GiFrenchFries, GiBowlOfRice } from "react-icons/gi";
import axios from "axios";

const ManageMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    base_price: "",
    image_url: "",
    is_available: true,
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/menu/categories/");
      const data = res.data.value || res.data || [];
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(prev => {
           if (!prev) return data[0];
           const updated = data.find(c => c.id === prev.id);
           return updated || data[0];
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/menu/categories/", newCat);
      setShowCategoryModal(false);
      setNewCat({ name: "", description: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateItem = async () => {
    if (!newItem.name || !newItem.base_price) {
        alert("Please fill required fields (Name, Price).");
        return;
    }
    try {
      await axios.post("http://localhost:8000/api/menu/menu/", {
        ...newItem,
        category: selectedCategory.id,
        base_price: parseFloat(newItem.base_price),
      });
      setIsAddingItem(false);
      setNewItem({
        name: "",
        description: "",
        base_price: "",
        image_url: "",
        is_available: true,
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (item, e) => {
    e.stopPropagation();
    try {
      await axios.patch(`http://localhost:8000/api/menu/menu/${item.id}/`, {    
        is_available: !item.is_available,
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      if (window.confirm("Delete this menu item?")) {
        await axios.delete(`http://localhost:8000/api/menu/menu/${id}/`);       
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("burger")) return <FaHamburger />;
    if (lowerName.includes("rice")) return <GiBowlOfRice />;
    if (lowerName.includes("side") || lowerName.includes("frie")) return <GiFrenchFries />;
    if (lowerName.includes("drink") || lowerName.includes("beverage")) return <FaCoffee />;
    if (lowerName.includes("dessert") || lowerName.includes("sweet")) return <FaIceCream />;
    return <FaUtensils />;
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1625813527987-a64d2579893d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  ];

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-white py-4 shadow-sm mb-5">
        <Container>
           <h2 className="mb-0">Manage Menu</h2>
        </Container>
      </div>

      <Container>
        <Row>
          {/* Sidebar Categories */}
          <Col md={3} className="mb-4">
            <div className="sticky-top pt-2" style={{ top: "20px", zIndex: 10 }}>
              <h6 className="text-muted small fw-bold mb-3 px-3 tracking-widest">CATEGORIES</h6>
              <div className="d-flex flex-column gap-2 mb-4">
                {categories.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;     
                  return (
                    <div
                      key={cat.id}
                      className={`d-flex align-items-center px-4 py-3 rounded-3 cursor-pointer transition-all ${
                        isSelected ? "bg-danger text-white shadow-sm" : "bg-transparent text-secondary hover-shadow hover-bg-light"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s ease", fontWeight: isSelected ? "600" : "500" }}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsAddingItem(false);
                      }}
                    >
                      <span className="me-3 fs-5">{getCategoryIcon(cat.name)}</span>
                      <span>{cat.name}</span>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline-danger" className="w-100 py-3 rounded-3 fw-bold" onClick={() => setShowCategoryModal(true)}>
                <FiPlus className="me-2" /> New Category
              </Button>
            </div>
          </Col>

          {/* Products Grid */}
          <Col md={9}>
            {selectedCategory && (
                <div className="mb-5">
                  <h4 className="fw-bold mb-4">{selectedCategory.name} Items</h4>        
                  <Row className="gy-4">
                    
                    {/* Add New Item Empty Card Form */}
                    {isAddingItem ? (
                       <Col md={4} sm={6}>
                          <Card className="border-0 shadow h-100" style={{ borderRadius: "15px", overflow: "hidden" }}>
                             <div className="w-100 bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style={{ height: "220px" }}>
                                <div className="text-center p-3">
                                    <FiImage size={40} className="text-muted mb-2" />
                                    <Form.Control size="sm" type="text" placeholder="Image URL (optional)" value={newItem.image_url} onChange={(e) => setNewItem({...newItem, image_url: e.target.value})} />
                                </div>
                             </div>
                             <Card.Body className="d-flex flex-column p-4 bg-white">
                                 <Form.Group className="mb-2">
                                    <Form.Control type="text" placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} autoFocus />
                                 </Form.Group>
                                 <Form.Group className="mb-2 flex-grow-1">
                                    <Form.Control as="textarea" rows={2} style={{resize: "none"}} placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} />
                                 </Form.Group>
                                 <Form.Group className="mb-3">
                                    <Form.Control type="number" step="0.01" placeholder="Base Price ($)" value={newItem.base_price} onChange={(e) => setNewItem({...newItem, base_price: e.target.value})} />
                                 </Form.Group>
                                 <div className="d-flex gap-2 mt-auto">
                                    <Button variant="secondary" className="flex-grow-1" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                                    <Button variant="danger" className="flex-grow-1" onClick={handleCreateItem}>Save</Button>
                                 </div>
                             </Card.Body>
                          </Card>
                       </Col>
                    ) : (
                       <Col md={4} sm={6}>
                          <Card 
                            className="border-2 border-dashed shadow-sm h-100 d-flex align-items-center justify-content-center bg-light hover-shadow" 
                            style={{ borderRadius: "15px", cursor: "pointer", minHeight: "380px", borderColor: "#dc3545" }}
                            onClick={() => setIsAddingItem(true)}
                          >
                             <div className="text-center text-danger">
                                 <FiPlus size={50} className="mb-2" />
                                 <h5 className="fw-bold mb-0">Add Menu Item</h5>
                                 <small className="text-muted">to {selectedCategory.name}</small>
                             </div>
                          </Card>
                       </Col>
                    )}

                    {selectedCategory.menus?.map((item) => {
                      const itemImage = item.image || item.image_url || defaultImages[item.id % defaultImages.length];
                      return (
                        <Col key={item.id} md={4} sm={6}>
                          <Card
                            className="border-0 shadow-sm h-100 position-relative hover-shadow transition-all"                                                  
                            style={{ borderRadius: "15px", overflow: "hidden", cursor: "default" }}
                          >
                            <div
                              className="position-absolute bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                              style={{ width: "55px", height: "55px", top: "15px", left: "15px", zIndex: 2, fontSize: "0.9rem" }}
                            >
                              ${parseFloat(item.base_price || item.price || 0).toFixed(2)}
                            </div>

                            <div className="position-absolute bg-dark text-white rounded-circle shadow-sm" style={{ top: "15px", right: "15px", zIndex: 2 }}>
                               <Button variant={item.is_available ? "success" : "secondary"} size="sm" className="rounded-circle p-2 d-flex" onClick={(e) => toggleAvailability(item, e)} title="Toggle Active/Inactive">
                                  <FiPower />
                               </Button>
                            </div>

                            <div className="w-100 bg-light position-relative" style={{ height: "220px" }}>
                              <img src={itemImage} alt={item.name} className="w-100 h-100" style={{ objectFit: "cover", filter: item.is_available ? "none" : "grayscale(100%)" }} />
                            </div>

                            <Card.Body className="d-flex flex-column p-4 bg-white">                                                                             
                              <div className="d-flex justify-content-between align-items-start mb-2">                                                           
                                <Card.Title className={`fw-bold fs-5 mb-0 text-dark ${!item.is_available ? "text-decoration-line-through" : ""}`}>                                                                            
                                  {item.name}
                                </Card.Title>
                              </div>
                              <Card.Text className="text-muted small mb-4 flex-grow-1">                                                                         
                                {item.description}
                              </Card.Text>
                              
                              <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-3"> 
                                <Badge bg={item.is_available ? "success" : "secondary"} className="px-3 py-2">
                                    {item.is_available ? "Active" : "Inactive"}
                                </Badge>                                                                             
                                <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-1" onClick={(e) => deleteItem(item.id, e)}>
                                  <FiTrash2 /> Delete
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
            )}
          </Col>
        </Row>
      </Container>


      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Form onSubmit={handleAddCategory}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control required type="text" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} autoFocus />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            <Button variant="danger" type="submit">Save Category</Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  );
};

export default ManageMenu;

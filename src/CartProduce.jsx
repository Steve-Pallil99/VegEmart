import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";

const PRODUCTS = [
  { id: 1, name: "Cabbage", price: 30 },
  { id: 2, name: "Spinach", price: 20 },
  { id: 3, name: "Turnip", price: 25 },
  { id: 4, name: "Calabaza", price: 40 },
  { id: 5, name: "Butternut Squash", price: 50 },
];

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function CartProduce() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userToken"));

    api.get("/viewitems")
      .then((res) => {
        const apiItems = res.data;
        setItems(apiItems);
      })
  }, []);

  const getId = (item) => item._id || item.id;

  const handleAdd = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = async () => {
    if (!selectedItem) return;

    if (!isLoggedIn) {
      alert("Login required");
      return;
    }

    try {
      const res = await api.post("/addtocart", {
        vegid:(selectedItem._id),
        quantity,
      });

      if (res.data.success) {
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/Cart");
      } else {
        alert(res.data.message || "Failed to add item");
      }
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert("Server error while adding to cart");
    }

    setShowModal(false);
  };

  const total = selectedItem ? selectedItem.pricePerKg* quantity : 0;

  return (
    <div className="p-4">
      <h2>All Produce</h2>

      <Row>
        {items.map((item) => (
          <Col md={4} key={(item._id)} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <p>Rs{item.pricePerKg}</p>

                <Button size="sm" onClick={() => handleAdd(item)}>
                  Add
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add to Cart</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedItem && (
            <>
              <h5>{selectedItem.name}</h5>
              <p>₹{selectedItem.pricePerKg}</p>

              <Form.Control
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
              />

              <h6 className="mt-3">Total: ₹{total}</h6>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CartProduce;
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router";

function CartProduce() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const axiosInstance = axios.create({baseURL: "http://localhost:3000/api",});

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    axiosInstance.get("/viewitems").then((res) => {
      setItems(res.data || []);
    });
  }, []);

  const handleAdd = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowModal(true);
  };

  const handleInfo = (item) => {
    if (item._id) {
      navigate(`/View/${item._id}`, { state: { item } });
    } else {
      navigate("/View", { state: { item } });
    }
  };

  const handleAddToCart = async () => {
    if (selectedItem?._id) {
      await axiosInstance.post("/addtocart", {vegid: selectedItem._id,quantity,});
    } else {
      alert(`Added ${selectedItem.name} x${quantity} = Rs.${selectedItem.price * quantity}`);
    }
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h2>All Produce</h2>
      <Row>
        {items.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <p>Rs.{item.price}</p>

                <div className="d-flex gap-2 flex-wrap">
                  <Button size="sm" variant="success" onClick={() => handleAdd(item)}>Add</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleInfo(item)}> Info </Button>
                </div>
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
              <p>Price: Rs.{selectedItem.price}</p>
              <Form.Control type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}/>
              <h6 className="mt-3">Total: Rs.{selectedItem.price * quantity}</h6>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddToCart}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CartProduce;
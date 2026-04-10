import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Table, Modal } from "react-bootstrap";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const fetchCart = async () => {
    try {
      const res = await api.get("/viewcart");
      setCartItems(res.data.data || []);
    } catch (error) {
      console.error("View cart error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (vegid) => {
    try {
      await api.post("/addtocart", {vegid,quantity: 1,});
      fetchCart();
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (vegid) => {
    try {
      await api.post("/addtocart", {vegid,quantity: -1,});
      fetchCart();
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const createOrder = async () => {
    try {
      setPlacingOrder(true);
      const res = await api.post("/createorder");

      if (res.data.success) {
        setOrderMessage("Order placed successfully!");
        fetchCart();

        setTimeout(() => {
          setShowModal(false);
          setOrderMessage("");
        }, 1500);
      }
    } catch (error) {
      console.error("Create order error:", error);
      setOrderMessage("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.vegid.price * item.quantity,
    0
  );

  const discountRate = 0.1;
  const deliveryFee = 20;
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <>
      <Container className="my-4">
        <Row>
          <Col md={8}>
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Add / Remove</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">Cart is empty</td>
                  </tr>
                ) : (
                  cartItems.map((item, index) => (
                    <tr key={item.vegid._id}>
                      <td>{index + 1}</td>
                      <td>{item.vegid.name}</td>
                      <td>₹{item.vegid.price}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <Button variant="danger" size="sm" className="me-2" disabled={item.quantity <= 1} onClick={() => removeFromCart(item.vegid._id)}> -</Button>
                        <Button  variant="success"  size="sm" onClick={() => addToCart(item.vegid._id)} > + </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <hr />
                <p>Original MRP: ₹{subtotal}</p>
                <p>Discount: -₹{discountAmount.toFixed(2)}</p>
                <p>Delivery Fee: ₹{deliveryFee}</p>
                <hr />
                <h5>Total: ₹{total.toFixed(2)}</h5>

                <Button variant="primary"  className="w-100 mt-3" disabled={cartItems.length === 0}  onClick={() => setShowModal(true)}>Pay Now</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to place this order?</p>
          <hr />
          <p>
            <strong>Total Amount:</strong> ₹{total.toFixed(2)}
          </p>

          {orderMessage && (
            <p className="text-center mt-2">{orderMessage}</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={placingOrder}>Cancel</Button>
          <Button variant="success" onClick={createOrder}  disabled={placingOrder}>{placingOrder ? "Placing Order..." : "Confirm Order"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Cart;

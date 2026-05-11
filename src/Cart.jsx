import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/viewcart");

      const items = res.data.data || [];

      setCartItems(items);

      const sum = items.reduce(
        (acc, item) => acc + item.subtotal,
        0
      );

      setTotal(sum);
    } catch (err) {
      console.error(
        "fetchCart error:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchCart();

    const update = () => fetchCart();

    window.addEventListener("cartUpdated", update);

    return () =>
      window.removeEventListener("cartUpdated", update);
  }, []);

  const increaseQty = async (productId) => {
    try {
      await api.post("/addtocart", {
        vegid: productId,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (productId) => {
    try {
      await api.post("/addtocart", {
        vegid: productId,
        quantity: -1,
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId, currentQty) => {
    try {
      await api.post("/addtocart", {
        vegid: productId,
        quantity: -currentQty,
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATED CHECKOUT
  const handleCheckout = () => {
    navigate("/Viewpage", {
      state: {
        orders: cartItems,
      },
    });
  };

  return (
    <Container className="my-4">
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cartItems.length === 0 ? (
            <tr>
              <td colSpan="6" align="center">
                Cart empty
              </td>
            </tr>
          ) : (
            cartItems.map((item, i) => (
              <tr key={item._id}>
                <td>{i + 1}</td>

                <td>{item.name}</td>

                <td>₹{item.price}</td>

                <td>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      decreaseQty(item.productId)
                    }
                  >
                    −
                  </Button>

                  <span className="mx-2">
                    {item.quantity}
                  </span>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      increaseQty(item.productId)
                    }
                  >
                    +
                  </Button>
                </td>

                <td>₹{item.subtotal}</td>

                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      removeItem(
                        item.productId,
                        item.quantity
                      )
                    }
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {cartItems.length > 0 && (
        <>
          <h5>Total: ₹{total}</h5>

          <Button onClick={handleCheckout}>
            Checkout / Print Invoice
          </Button>
        </>
      )}
    </Container>
  );
}

export default Cart;
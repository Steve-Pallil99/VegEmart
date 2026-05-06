import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

function Viewpage() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/orders/${user._id}`
        );
        setOrders(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  const subtotal = orders.reduce((sum, o) => {
    return sum + (o.itemid?.price || 0) * o.itemcount;
  }, 0);

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2 align="center">Invoice</h2>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">No orders</td>
            </tr>
          ) : (
            orders.map((o, i) => {
              const totalItem =
                (o.itemid?.price || 0) * o.itemcount;

              return (
                <tr key={i}>
                  <td>{o.itemid?.name}</td>
                  <td>{o.itemid?.price}</td>
                  <td>{o.itemcount}</td>
                  <td>{totalItem}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      <div style={{ textAlign: "right" }}>
        <p>Subtotal: Rs{subtotal.toFixed(2)}</p>
        <p>Tax: Rs{tax.toFixed(2)}</p>
        <h5>Total: Rs{total.toFixed(2)}</h5>
      </div>
    </div>
  );
}

export default Viewpage;
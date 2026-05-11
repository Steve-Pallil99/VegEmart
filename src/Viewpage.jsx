import { useLocation } from "react-router";
import Table from "react-bootstrap/Table";

function Viewpage() {
  const location = useLocation();

  const orders = location.state?.orders || [];

  const subtotal = orders.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05;

  const total = subtotal + tax;

  return (
    <div style={{ padding: 20 }}>
      <h2 align="center">Invoice</h2>

      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No Orders
              </td>
            </tr>
          ) : (
            orders.map((item, index) => {
              const itemTotal =
                item.price * item.quantity;

              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>{item.name}</td>

                  <td>₹{item.price}</td>

                  <td>{item.quantity}</td>

                  <td>₹{itemTotal}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {orders.length > 0 && (
        <div style={{ textAlign: "right" }}>
          <p>
            <strong>Subtotal:</strong> ₹
            {subtotal.toFixed(2)}
          </p>

          <p>
            <strong>Tax (5%):</strong> ₹
            {tax.toFixed(2)}
          </p>

          <h4>Total: ₹{total.toFixed(2)}</h4>
        </div>
      )}
    </div>
  );
}

export default Viewpage;
import Table from "react-bootstrap/Table";

function Viewpage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>VegEmart</h1>

      <h4>Billing To:</h4>
      <p>
        Bob<br />
        Street Avenue 10019<br />
        Miami, FL
      </p>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price ($)</th>
            <th>Qty</th>
            <th>Total ($)</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Tomatoes</td>
            <td>0.00</td>
            <td>0</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td>Potatoes</td>
            <td>0.00</td>
            <td>0</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td>Onions</td>
            <td>0.00</td>
            <td>0</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td>Bananas</td>
            <td>0.00</td>
            <td>0</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td>Apples</td>
            <td>0.00</td>
            <td>0</td>
            <td>0.00</td>
          </tr>
        </tbody>
      </Table>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <p>Subtotal: $0.00</p>
        <p>Tax: 0.00%</p>
        <h5>Total: $0.00</h5>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h5>Terms & Conditions:</h5>
        <p style={{ fontSize: "14px" }}>
          All vegetable and fruit prices are subject to daily market changes. 
          Payments must be made within 7 working days from the date of invoice. 
          Goods once sold cannot be returned unless damaged at delivery time.
        </p>
      </div>
    </div>
  );
}

export default Viewpage;

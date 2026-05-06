import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import axios from "axios";

function Invoiceview() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const res = await axios.get( "http://localhost:5000/order/invoice", { headers: { Authorization: `Bearer ${token}`,},}
      );

      console.log("API Response:", res.data);

      if (res.data?.success && Array.isArray(res.data.data)) {
        setItems(res.data.data);
      } else if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setError("Invalid invoice data format");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Server error");
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError("Request error");
      }

    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  const totalQuantity = items.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  return (
    <div className="w-full p-6 flex flex-col items-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Invoice</h1>
          <p className="text-sm text-gray-600">
            Generated from your orders
          </p>
        </div>

        {loading && (
          <p className="text-gray-500">Loading invoice...</p>
        )}

        {!loading && error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-gray-500">No orders found</p>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.product || "N/A"}</td>
                    <td>{item.quantity || 0}</td>
                    <td>Rs{(item.price || 0) * (item.quantity || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Card className="p-5 mt-8 text-lg rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Summary
              </h2>
              <p>
                <strong>Total Items:</strong> {totalQuantity}
              </p>
              <p className="text-xl font-bold">Total Amount:<span className="text-green-700 ml-2"> Rs{totalAmount}</span>
              </p>
            </Card>
          </>
        )}

      </div>
    </div>
  );
}

export default Invoiceview;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Admindetails = () => {
  const { id } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await axios.get(
          `http://localhost:3000/api/getorder/${id}`,
          {
            headers: {Authorization: `Bearer ${token}`, },
          }
        );

        if (res.status === 200 && res.data.success) {
          setOrder(res.data.data);
        } else {
          setError("Failed to load order");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(
          err.response?.data?.message || "Server error while fetching order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const calculateTotalAmount = () => {
    if (!order) return 0;
    return order.items.reduce((total, item) => total + item.quantity * item.price,0);
  };

  if (loading) {
    return <h5 className="text-center mt-4">Loading order details...</h5>;
  }

  if (error) {
    return <h5 className="text-center mt-4 text-danger">{error}</h5>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Order Details (ID: {order._id})</h3>
      <div className="mb-4">
        <h5>Ordered By</h5>
        <p><strong>Name:</strong> {order.user.name}</p>
        <p><strong>Email:</strong> {order.user.email}</p>
        <p><strong>Address:</strong> {order.user.address}</p>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price (Rs)</th>
            <th>Total (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5 className="text-end mt-3">Grand Total: Rs{calculateTotalAmount()}</h5>

      <div className="mt-4">
        <Button variant="success" className="me-2"> Mark as Delivered</Button>
        <Button variant="danger">Cancel Order</Button>
      </div>
    </div>
  );
};

export default Admindetails;

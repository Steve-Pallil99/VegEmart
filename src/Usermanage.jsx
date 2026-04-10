import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function UserManage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [editUser, setEditUser] = useState({_id: "",name: "",email: "",address: "",});

  const fetchUsers = async () => {
    try {
      const res = await api.get("/getallusers");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser({_id: user._id,name: user.name,email: user.email,address: user.address,});
    setShowModal(true);
  };

  const handleViewOrders = async (userId) => {
    try {
      const res = await api.get(`/getuserorders?userid=${userId}`);

      if (res.data.success) {
        setOrders(res.data.data);
        setShowOrdersModal(true);
      }
    } catch (error) {
      console.error("Error fetching user orders");
    }
  };

  const handleSave = () => {
    alert("Update API not implemented yet");
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h2>User Management</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th width="200">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleEdit(user)} >Edit</Button>

                    <Button variant="info"  size="sm" onClick={() => handleViewOrders(user._id)} >View Orders</Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No Users Found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={editUser.name}  onChange={(e) => setEditUser({ ...editUser, name: e.target.value }) }/></Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}/></Form.Group>

            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control  value={editUser.address} onChange={(e) => setEditUser({ ...editUser, address: e.target.value }) }/></Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOrdersModal} onHide={() => setShowOrdersModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Orders</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {orders.length > 0 ? (
            <Table striped bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.itemid?.name}</td>
                    <td>₹{order.itemid?.price}</td>
                    <td>{order.itemcount}</td>
                    <td>{order.status}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No Orders Found</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrdersModal(false)} >Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserManage;
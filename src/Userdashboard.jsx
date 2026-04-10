import React, { useState, useEffect } from "react";
import axios from "axios";
import {Tab,Tabs,Card,Form,Button,InputGroup,Table,Modal,} from "react-bootstrap";

const api = axios.create({baseURL: "http://localhost:3000/api",});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function Userdashboard() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [salesSummary, setSalesSummary] = useState({totalOrders: 0,totalItemsSold: 0,});
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [issue, setIssue] = useState("");
  const [orderId, setOrderId] = useState("");
  const [category, setCategory] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [showComplaintList, setShowComplaintList] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/myprofile");
      if (res.data.success) {
        setProfile(res.data.data);
        setName(res.data.data.name || "");
        setEmail(res.data.data.email || "");
        setPhone(res.data.data.phone || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get("/getmyorders");
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchSalesSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await api.get("/salessummary");
      if (res.data.success) setSalesSummary(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/showcomplaint");
      if (res.data.success) setComplaints(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateName = async () => {
    try {
      const res = await api.patch("/updatename", { name });
      if (res.data.success) {
        alert("Name updated");
        setProfile(res.data.data);
        setEditingName(false);
      }
    } catch {
      alert("Failed to update name");
    }
  };

  const updateEmail = async () => {
    try {
      const res = await api.patch("/updateemail", { email });
      if (res.data.success) {
        alert("Email updated");
        setProfile(res.data.data);
        setEditingEmail(false);
      }
    } catch {
      alert("Failed to update email");
    }
  };

  const updatePhone = async () => {
    try {
      const res = await api.patch("/updatephone", { phone });
      if (res.data.success) {
        alert("Phone updated");
        setProfile(res.data.data);
        setEditingPhone(false);
      }
    } catch {
      alert("Failed to update phone");
    }
  };

  const submitComplaint = async () => {
    if (!orderId || !category || !issue) {
      alert("All fields required");
      return;
    }

    try {
      const res = await api.post("/createcomplaint", {
        orderid: orderId,
        category,
        issue,
      });

      if (res.data.success) {
        alert("Complaint submitted");
        setShowModal(false);
        setIssue("");
        setOrderId("");
        setCategory("");
        fetchComplaints();
      }
    } catch {
      alert("Failed to submit complaint");
    }
  };

  const resetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await api.patch("/resetone", {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        alert("Password updated");
        setShowResetModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      alert("Password reset failed");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchSalesSummary();
    fetchComplaints();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Dashboard</h2>
      <Tabs defaultActiveKey="profile" fill>
        <Tab eventKey="profile" title="Profile">
          <Card className="p-4 mt-3">

            <InputGroup className="mb-3">
              <InputGroup.Text>Name</InputGroup.Text>
              <Form.Control value={name} readOnly={!editingName} onChange={(e) => setName(e.target.value)}/>{!editingName ? (<Button  variant="warning"  onClick={() => setEditingName(true)}>Edit</Button>
              ) : (
                <Button variant="success" onClick={updateName}>Save</Button>
              )}
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Email</InputGroup.Text>
              <Form.Control value={email} readOnly={!editingEmail} onChange={(e) => setEmail(e.target.value)}/>
              {!editingEmail ? (
                <Button variant="warning" onClick={() => setEditingEmail(true)}> Edit</Button>
              ) : (
                <Button variant="success" onClick={updateEmail} >Save</Button>
              )}
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Phone</InputGroup.Text>
              <Form.Control value={phone} readOnly={!editingPhone} onChange={(e) => setPhone(e.target.value)}/>
              {!editingPhone ? (
                <Button variant="warning" onClick={() => setEditingPhone(true)}>Edit</Button>
              ) : (
                <Button variant="success" onClick={updatePhone}>Save</Button>
              )}
            </InputGroup>
            <Button variant="danger" onClick={() => setShowResetModal(true)} >Reset Password </Button>
          </Card>
        </Tab>

        <Tab eventKey="orders" title="Orders">
          <Card className="p-4 mt-3">
            <h4>Your Orders</h4>
            <Card className="p-3 mb-3 bg-light">
              <h5>Sales Summary</h5>
              {loadingSummary ? (
                <p>Loading...</p>
              ) : (
                <div className="d-flex gap-4">
                  <div> <strong>Total Orders:</strong>{" "} {salesSummary.totalOrders}</div>
                  <div><strong>Total Items Sold:</strong>{" "}{salesSummary.totalItemsSold}</div>
                </div>
              )}
            </Card>

            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Order ID</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order.itemid?.name}</td>
                      <td>{order._id}</td>
                      <td>{order.quantity || order.itemcount}</td>
                      <td>{order.itemid?.price}</td>
                      <td> <span className={`badge bg-${ order.status === "delivered" ? "success" : "warning"}`}>{order.status}</span> </td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            )}
          </Card>
        </Tab>

        <Tab eventKey="complaints" title="Complaints">
          <Card className="p-4 mt-3">
            <Button variant="danger" className="me-2" disabled={orders.length === 0} onClick={() => setShowModal(true)}>+ New Complaint</Button>
            <Button variant="info" onClick={() => setShowComplaintList(true)} >Show Complaints</Button>
          </Card>
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Create Complaint</Modal.Title></Modal.Header>
        <Modal.Body>

          <Form.Group className="mb-3">
            <Form.Label>Order ID</Form.Label>
            <Form.Control value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control value={category} onChange={(e) => setCategory(e.target.value)}/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Issue</Form.Label>
            <Form.Control as="textarea" rows={3} value={issue} onChange={(e) => setIssue(e.target.value)}/>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} > Cancel</Button>
          <Button variant="primary" onClick={submitComplaint}>Submit</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" value={currentPassword}  onChange={(e) =>  setCurrentPassword(e.target.value)  }/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)  }/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value) }/>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)} > Cancel</Button>
          <Button variant="primary" onClick={resetPassword}>Update Password</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Userdashboard;
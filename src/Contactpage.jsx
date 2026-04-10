import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

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

function ContactPage() {
  const [formData, setFormData] = useState({name: "",email: "",subject: "", message: "", });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await api.post("/contact", formData);

      if (response.data.success) {
        setSuccessMsg(response.data.message);
        setFormData({ name: "", email: "", subject: "", message: "", });
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Contact Us</h2>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter your name" value={formData.name}  onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="name@example.com"  value={formData.email} onChange={handleChange}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control  type="text"  name="subject"  placeholder="Enter subject" value={formData.subject} onChange={handleChange}/>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea"  rows={4}  name="message" placeholder="Write your message..." value={formData.message} onChange={handleChange}/>
        </Form.Group>

        <div className="d-grid">
          <Button type="submit" variant="primary" disabled={loading}>{loading ? "Sending..." : "Submit"}</Button>
        </div>
      </Form>
    </Container>
  );
}

export default ContactPage;

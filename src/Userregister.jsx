import { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function Userregister() {
  const [formData, setFormData] = useState({name: "",email: "",address: "",password: "",});

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/register", formData);

      if (res.data.message === "Registration successfull") {
        setSuccess(res.data.message);
        setFormData({ name: "", email: "", address: "", password: "",});
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>User Registration</h3>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Control type="text" name="name" placeholder="Name"  value={formData.name}  onChange={handleChange}  required/>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}  required/>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control  type="text" name="address"  placeholder="Address"  value={formData.address}  onChange={handleChange}  required/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control type="password" name="password" placeholder="Password" value={formData.password}  onChange={handleChange}  required/>
        </Form.Group>

        <Button type="submit" variant="success">Register</Button>
      </Form>
    </div>
  );
}

export default Userregister;

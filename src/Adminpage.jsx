import { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router";

function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      navigate("/Admindashboard"); 
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");

    const newErrors = {};

    if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!passwordRegex.test(password)) {
      newErrors.password ="Password must be 8+ chars, include uppercase, lowercase, number & special char";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.post("http://localhost:3000/api/AdminLogin", { username: email, password: password, });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        setIsLoggedIn(true);
        setServerMsg("Login Successful");
        navigate("/Admindashboard"); 
      } else {
        setServerMsg(res.data.message || "Login failed");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setServerMsg(err.response.data.message);
      } else {
        setServerMsg("Server error");
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <h3 className="text-center mb-4">Admin Login</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={email} placeholder="Enter admin email" onChange={(e) => setEmail(e.target.value)} isInvalid={!!errors.email}/>
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} placeholder="Enter admin password" onChange={(e) => setPassword(e.target.value)} isInvalid={!!errors.password}/>
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            {serverMsg && (<div className="text-center text-danger mb-3">{serverMsg}</div>)}

            <div className="text-center"><Button type="submit" variant="info">Submit</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
import React, { useState } from "react";
import { Form, Button, Card, Placeholder } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Userfield() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value) => emailRegex.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);

        const response = await axios.post("http://localhost:3000/api/forgotpass",{ email });

        if (response.data.success) {
          alert(response.data.message);
          const token = response.data.token;
          navigate(`/reset-password/${token}`);
        } else {
          alert(response.data.message);
        }

        setEmail("");
      } catch (error) {
        alert("Server error. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <Card.Body>
        <Card.Title className="text-center mb-4">Forgot Password</Card.Title>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email}  isInvalid={!!errors.email} onChange={(e) => setEmail(e.target.value)}   placeholder="Enter your email"/>
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {loading ? (
            <>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} />
              </Placeholder>
              <Placeholder.Button xs={12} />
            </>
          ) : (
            <Button type="submit" variant="primary" className="w-100">Submit</Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Userfield;
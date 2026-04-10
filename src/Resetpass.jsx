import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function Resetpass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};

    if (!passwordRegex.test(newPassword)) {
      tempErrors.newPassword =
        "Password must be 8+ chars, include uppercase, lowercase, number & special character.";
    }

    if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validate()) {
      try {
        setLoading(true);

        const response = await axios.patch( `http://localhost:3000/api/resetpass/`, {password: newPassword,token:id} );

        if (response.data.success) {
          alert("Password Reset Successful!");
          navigate("/");
        } else {
          setServerError(response.data.message);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Server error. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "20px" }}>
        <h3 className="text-center mb-4">Reset Password</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Enter New Password</Form.Label>
            <Form.Control
              type="password"  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} isInvalid={!!errors.newPassword}/>
            <Form.Control.Feedback type="invalid">
              {errors.newPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} isInvalid={!!errors.confirmPassword}/>
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {serverError && (
            <div className="text-danger mb-3 text-center">
              {serverError}
            </div>
          )}

          {loading ? (
            <>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} />
              </Placeholder>
              <Placeholder.Button xs={12} />
            </>
          ) : (
            <div className="d-grid">
              <Button type="submit">Submit</Button>
            </div>
          )}
        </Form>
      </Card>
    </Container>
  );
}

export default Resetpass;
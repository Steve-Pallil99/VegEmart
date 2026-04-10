import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Placeholder from "react-bootstrap/Placeholder";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/;
const api = axios.create({baseURL: "http://localhost:3000/api/",});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Userlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userToken"));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!emailRegex.test(email)) {
      return setMessage("Invalid email format.");
    }

    if (!passwordRegex.test(password)) {
      return setMessage("Password must contain uppercase, lowercase, number, special character and minimum 8 characters.");
    }

    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("userToken", res.data.token);
        setIsLoggedIn(true);
        setMessage(res.data.message);
        window.location.reload();

      } else {
        setMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      setMessage( err.response?.data?.message || err.response?.data ||"Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setMessage("Logged out successfully");
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Form onSubmit={handleLogin} style={{ width: "350px" }}  className="p-4 border rounded shadow-sm">
        <h4 className="text-center mb-4">User Login</h4>

        {message && <Alert variant="info">{message}</Alert>}

        {isLoggedIn ? (
          <>
            <div className="text-center mb-3">
              <p>You are logged in ✅</p>
            </div>

            <Button variant="danger" className="w-100" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email"  value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password"  value={password} onChange={(e) => setPassword(e.target.value)}  required />
            </Form.Group>

            <div className="text-end mb-3">
              <Link to="/Userfield" className="text-decoration-none">Forgot Password?</Link>
            </div>

            {loading ? (
              <>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
                <Placeholder.Button xs={12} />
              </>
            ) : (
              <Button type="submit" className="w-100">Login</Button>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

export default Userlogin;
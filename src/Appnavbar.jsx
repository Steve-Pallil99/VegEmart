import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";

function Appnavbar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = () => {
      const adminToken = localStorage.getItem("adminToken");
      const userToken = localStorage.getItem("userToken");

      if (adminToken) setRole("admin");
      else if (userToken) setRole("user");
      else setRole(null);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    setRole(null);
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">VegEmart</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {role === "admin" && (
              <>
                <Nav.Link as={Link} to="/Admindashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/Usermanage">UserManage</Nav.Link>
                 {/* <Nav.Link as={Link} to="/Complaints">Complaint</Nav.Link> */}
                <Nav.Link as={Link} to="/Productmanage">ProductManage</Nav.Link>
                <Nav.Link as={Link} to="/Ordermanage">OrderManage</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
            {role === "user" && (
              <>
                <Nav.Link as={Link} to="/CartProduce">Cart</Nav.Link>
                <Nav.Link as={Link} to="/Userreview">Review</Nav.Link>
                {/* <Nav.Link as={Link} to="/Invoiceview">Invoice</Nav.Link> */}
                <Nav.Link as={Link} to="/Cart">Bill</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
            {!role && (
              <>
                <Nav.Link as={Link} to="/Userregister">Register</Nav.Link>
                <Nav.Link as={Link} to="/Contactpage">Contact Us</Nav.Link>
                <Nav.Link as={Link} to="/Userlogin">Login</Nav.Link>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Appnavbar;
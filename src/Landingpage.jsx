import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Landingpage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
        <Container>
          <Navbar.Brand href="#home">VegEmart</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#products">Products</Nav.Link>
              <NavDropdown title="More" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/1">Contact</NavDropdown.Item>
                <NavDropdown.Item href="#action/2">Help</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <header className="bg-light text-center py-5">
        <h1 className="display-4 fw-bold">Welcome to VegEmart</h1>
        <p className="lead">Your fresh marketplace for vegetables & fruits</p>
      </header>


      <div style={{ flexGrow: 1 }}></div>

      <footer className="bg-dark text-white text-center py-3" style={{ marginTop: "auto" }}>
        <small>© 2025 VegEmart. All rights reserved.</small>
      </footer>

    </div>
  );
}

export default Landingpage;

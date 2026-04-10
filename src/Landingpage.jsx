import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Landingpage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      

      <header className="bg-light text-center py-5">
        <h1 className="display-4 fw-bold">Welcome to VegEmart</h1>
        <p className="lead">Your fresh marketplace for vegetables & fruits</p>
      </header>


      <div style={{ flexGrow: 1 }}></div>

     

    </div>
  );
}

export default Landingpage;

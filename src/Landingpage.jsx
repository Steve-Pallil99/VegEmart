import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

export function Landingpage() {
  const handleNavigate = () => { window.location.href = "/HomeBrowse";};

  return (
    <div style={{  display: "flex",  flexDirection: "column",  minHeight: "100vh",  backgroundColor: "#f8f9fa", }} >
      <header className="bg-light text-center py-5 shadow-sm">
        <Container>
          <h1 className="display-4 fw-bold text-success">Welcome to VegEmart</h1>
          <p className="lead text-muted">Your fresh marketplace for vegetables & fruits</p>
          <Button variant="success"  size="lg" className="mt-3"  onClick={handleNavigate}> Get Started</Button>
        </Container>
      </header>

      <section className="py-5 flex-grow-1">
        <Container>
          <p className="text-center text-muted mx-auto mb-5" style={{ maxWidth: "850px" }}>
            VegEmart focuses on helping customers explore, buy, and learn about
            a wide variety of vegetables and fruits. This project aims to bring
            a simple, user-friendly online marketplace where buyers can discover
            fresh produce grown both in India and abroad, along with helpful
            information about their benefits and drawbacks.
          </p>

          <Row className="g-4">
            <Col md={4}>
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <h4 className="fw-bold mb-3 text-success">Explore Fresh Produce</h4>

                <ul>
                  <li>
                    Browse vegetables and fruits from local and international
                    sources.
                  </li>

                  <li>
                    Discover seasonal items and rare varieties.
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={4}>
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <h4 className="fw-bold mb-3 text-success">
                  Buy with Ease
                </h4>

                <ul>
                  <li>User-friendly shopping experience.</li>
                  <li>Secure checkout and fast delivery options.</li>
                </ul>
              </div>
            </Col>

            <Col md={4}>
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <h4 className="fw-bold mb-3 text-success"> Learn Benefits & Drawbacks</h4>

                <ul>
                  <li>Get insights into nutritional value.</li>
                  <li>Understand pros and cons before buying.</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">
          © 2026 VegEmart | Fresh Fruits & Vegetables Marketplace
        </p>
      </footer>
    </div>
  );
}

export default Landingpage;
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Aboutpage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="w-full py-4 bg-gray-900 text-white text-center">
        <h2 className="text-xl font-semibold">Navbar</h2>
      </header>

      <div className="w-full py-10">
        <h1 className="text-3xl font-bold text-center mb-8">VegEmart</h1>

        <p className="text-center max-w-2xl mx-auto mb-10">
          VegEmart focuses on helping customers explore, buy, and learn about a
          wide variety of vegetables and fruits. This project aims to bring a
          simple, user-friendly online marketplace where buyers can discover
          fresh produce grown both in India and abroad, along with helpful
          information about their benefits and drawbacks.
        </p>

        <Container>
          <Row className="mb-4">
            <Col md={4}>
              <div className="p-6 shadow rounded-lg bg-white">
                <h3 className="font-semibold text-lg mb-3">Explore Fresh Produce</h3>
                <ul className="list-disc ms-4">
                  <li>Browse vegetables and fruits from local and international sources.</li>
                  <li>Discover seasonal items and rare varieties.</li>
                </ul>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-6 shadow rounded-lg bg-white">
                <h3 className="font-semibold text-lg mb-3">Buy with Ease</h3>
                <ul className="list-disc ms-4">
                  <li>User-friendly shopping experience.</li>
                  <li>Secure checkout and fast delivery options.</li>
                </ul>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-6 shadow rounded-lg bg-white">
                <h3 className="font-semibold text-lg mb-3">Learn Benefits & Drawbacks</h3>
                <ul className="list-disc ms-4">
                  <li>Get insights into nutritional value.</li>
                  <li>Understand pros and cons before buying.</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

 
      <footer className="w-full py-4 bg-gray-900 text-white text-center">
        <p>Footer</p>
      </footer>
    </div>
  );
}

export default Aboutpage;

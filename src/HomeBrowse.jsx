import React from 'react';
import { Container, Row, Col, Card, Button, InputGroup, FormControl } from 'react-bootstrap';

const PRODUCTS = [
  { id: 1, name: 'Cabbage', category: 'Vegetable', price: '₹30 / kg', img: '',
    desc: 'Leafy brassica grown for its dense heads. Great raw in slaws or cooked in stews.' },
  { id: 2, name: 'Spinach', category: 'Vegetable', price: '₹50 / bunch', img: '',
    desc: 'Tender leafy green, rich in iron and vitamins — use fresh or cooked.' },
  { id: 3, name: 'Turnip', category: 'Vegetable', price: '₹40 / kg', img: '',
    desc: 'White-fleshed root vegetable; mild when small, used roasted, boiled or in soups.' },
  { id: 4, name: 'Calabaza', category: 'Vegetable', price: '₹60 / kg', img: '',
    desc: 'Tropical winter squash (a.k.a. West Indian pumpkin). Sweet, great for stews.' },
  { id: 5, name: 'Butternut Squash', category: 'Vegetable', price: '₹80 / kg', img: '',
    desc: 'Sweet, nutty flesh — perfect roasted, pureed into soups or baked goods.' },

  { id: 6, name: 'Banana', category: 'Fruit', price: '₹50 / dozen', img: '',
    desc: 'Soft, sweet tropical fruit; great as a snack or in smoothies.' },
  { id: 7, name: 'Avocado', category: 'Fruit', price: '₹120 / pc', img: '',
    desc: 'Creamy, nutrient-dense berry — use in salads, toast, or guacamole.' },
  { id: 8, name: 'Blueberry', category: 'Fruit', price: '₹250 / 250g', img: '',
    desc: 'Small antioxidant-rich berries — perfect for baking, jams and fresh snacking.' },
  { id: 9, name: 'Cherry', category: 'Fruit', price: '₹300 / 250g', img: '',
    desc: 'Juicy stone fruit — sweet or tart varieties; excellent fresh or in desserts.' },
  { id: 10, name: 'Cranberry', category: 'Fruit', price: '₹220 / 250g', img: '',
    desc: 'Tart berries often used for sauces, juices and as a superfruit ingredient.' }
];

function HomeBrowse() {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('All');

  const filtered = PRODUCTS.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' ? true : p.category === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <Container className="py-4">
      <h2 className="mb-3">Fresh Vegetables & Fruits</h2>

      <Row className="align-items-center mb-3">
        <Col md={6} className="mb-2">
          <InputGroup>
            <FormControl placeholder="Search produce (e.g. 'avocado')" value={query} onChange={e => setQuery(e.target.value)}/>
            <Button variant="outline-secondary" onClick={() => setQuery('')}>Clear</Button>
          </InputGroup>
        </Col>

        <Col md={6} className="text-md-end">
          <Button variant={filter === 'All' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setFilter('All')} className="me-2">All</Button>
          <Button variant={filter === 'Vegetable' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setFilter('Vegetable')} className="me-2">Vegetables</Button>
          <Button variant={filter === 'Fruit' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setFilter('Fruit')}>Fruits</Button>
        </Col>
      </Row>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filtered.map(item => (
          <Col key={item.id}>
            <Card className="h-100 shadow-sm">
              <div style={{ height: 160, overflow: 'hidden' }}>
                <Card.Img variant="top" src={item.img} alt={item.name} style={{ objectFit: 'cover', height: '100%', width: '100%' }}/>
              </div>

              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-1">{item.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: 12 }}>{item.category} • {item.price}</Card.Subtitle>

                <Card.Text className="flex-grow-1" style={{ fontSize: 14 }}>{item.desc}</Card.Text>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <Button variant="success" size="sm" href="/Cart">Add to cart</Button>
                  <Button variant="outline-secondary" size="sm"href="/View" >View</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </Container>
  );
}

export default HomeBrowse;

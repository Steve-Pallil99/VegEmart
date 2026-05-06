import React, { useState, useEffect } from "react";
import {Container, Row, Col, Card, Button,Image, Form, ListGroup, Alert} from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router";

function View() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = "http://localhost:3000/api";

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await axios.get(`${API}/viewitem/${id}`);

        if (res.data?.success && res.data.data) {
          setItem(res.data.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("PRODUCT FETCH ERROR:", err.response || err);

        if (err.response?.status === 500) {
          setError("Server error (500). Check backend.");
        } else if (err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError(err.response?.data?.message || "Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await axios.get(`${API}/productreview/${id}`);
        if (res.data?.success) {
          setReviews(res.data.data || []);
        }
      } catch (err) {
        console.error("REVIEW FETCH ERROR:", err.response || err);
      }
    })();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token || !id) return;

    (async () => {
      try {
        const res = await axios.get(
          `${API}/myproductreview/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.success) {
          setMyReview(res.data.data);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("MY REVIEW ERROR:", err.response || err);
        }
      }
    })();
  }, [id]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Login required");
      return;
    }

    try {
      const res = await axios.post( `${API}/customerreview`, { product_id: id, rating, message,}, {headers: { Authorization: `Bearer ${token}` },} );

      if (res.data?.success) {
        setMyReview(res.data.data);
        setReviews((prev) => [res.data.data, ...prev]);
        setMessage("");
      }
    } catch (err) {
      console.error("SUBMIT REVIEW ERROR:", err.response || err);

      if (err.response?.status === 500) {
        alert("Server error (500)");
      } else {
        alert(err.response?.data?.message || "Submit failed");
      }
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  if (error)
    return <p className="text-center text-danger">{error}</p>;

  if (!item)
    return <p className="text-center">No product found</p>;

  return (
    <Container className="my-4">
      <Row>
        <Col md={12} className="text-center">
          <h1>{item.name}</h1>
        </Col>

        <Col md={12} className="text-center mb-4">
          <Image src={item.image || ""} fluid rounded />
        </Col>

        <Col md={12}>
          <Card>
            <Card.Body>
              <h4>Customer Reviews</h4>

              {myReview ? (
                <Alert variant="success">
                  <strong>You already reviewed this product</strong>
                  <p className="mt-2">{myReview.message}</p>
                </Alert>
              ) : (
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select value={rating}  onChange={(e) => setRating(Number(e.target.value))} >
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {r} Star
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Control  as="textarea"  rows={3} className="mb-2" placeholder="Write your review" value={message}onChange={(e) => setMessage(e.target.value)}  />

                  <Button onClick={handleSubmit}> Submit Review </Button>
                </Form>
              )}

              <ListGroup className="mt-3">
                {reviews.length === 0 && (
                  <ListGroup.Item>No reviews yet</ListGroup.Item>
                )}

                {reviews.map((r) => (
                  <ListGroup.Item key={r._id}>
                    <strong>
                      {r.user_id?.name || "Anonymous"}
                    </strong>
                    <div>Rating: {r.rating || "N/A"}</div>
                    <div>{r.message}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default View;
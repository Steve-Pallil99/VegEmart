import React, { useState, useEffect } from "react";
import {Container,Row,Col,Card,Button,Image,Form,ListGroup,Alert,} from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router";

function StarIcon({ filled = false, size = 24, ...props }) {
  const style = {width: size,height: size,cursor: props.onClick ? "pointer" : "default",color: filled ? "#f6b319" : "#cfcfcf",};

  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style} {...props}>
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

function StarRatingInput({ rating, setRating }) {
  return (
    <div className="mb-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} onClick={() => setRating(n)}>
          <StarIcon filled={n <= rating} size={26} />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <ListGroup.Item>

      <strong>{review.user_id?.name || "Anonymous"}</strong>

      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} size={14} filled={n <= review.rating} />
        ))}
      </div>

      <div>{review.message}</div>
    </ListGroup.Item>
  );
}

function View() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/viewitem/${id}`);
        if (res.data.success) setItem(res.data.data);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/productreview/${id}`);
        if (res.data.success) setReviews(res.data.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const res = await axios.get(`http://localhost:3000/api/myproductreview/${id}`,{headers: { Authorization: `Bearer ${token}` },});
        if (res.data.success) setMyReview(res.data.data);
      } catch (err) {
        if (err.response?.status !== 404) console.error(err);
      }
    })();
  }, [id]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please login to submit a review");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/customerreview",{ product_id: id, rating, message },{ headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        setMyReview(res.data.data);
        setReviews((prev) => [res.data.data, ...prev]);
        setMessage("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Review submit failed");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <Container className="my-4">
      <Row>
        <Col md={12} className="text-center">
          <h1>{item?.name}</h1>
        </Col>

        <Col md={12} className="text-center mb-4">
          <Image src={item?.image} fluid rounded />
        </Col>

        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4>Customer Reviews</h4>

              {myReview ? (
                <Alert variant="success">
                  <strong>You already reviewed this product</strong>
                  <div className="mt-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} size={16} filled={n <= myReview.rating}/>
                    ))}
                    <p className="mt-1">{myReview.message}</p>
                  </div>
                </Alert>
              ) : (
                <Form>
                  <StarRatingInput rating={rating} setRating={setRating} />
                  <Form.Control as="textarea" rows={3} className="mb-2" placeholder="Write your review" value={message} onChange={(e) => setMessage(e.target.value)}/>
                  <Button onClick={handleSubmit}>Submit Review</Button>
                </Form>
              )}

              <ListGroup className="mt-3">
                {reviews.map((r) => (
                  <ReviewCard key={r._id} review={r} />
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

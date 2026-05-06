import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

function Userreview({ productId }) {
  const token = localStorage.getItem("token");

  const [review, setReview] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    if (productId) {
      fetchMyReview();
    }
  }, [productId]);

  const fetchMyReview = async () => {
    try {
      const res = await axios.get( `http://localhost:3000/api/myproductreview/${productId}`,{headers: { Authorization: `Bearer ${token}`,},});

      if (res.data?.data) {
        setReview(res.data.data);
        setMessage(res.data.data.message);
        setRating(res.data.data.rating);
      } else {
        setReview(null);
        setMessage("");
        setRating(1);
      }
    } catch (err) {
      setReview(null);
    }
  };

  const handleSubmit = async () => {
    if (!token) return alert("Please login first");
    if (!message.trim()) return alert("Enter review");

    try {
      await axios.post(`http://localhost:3000/api/myproductreview/${productId}`,{ rating: Number(rating), message: message, }, {headers: { Authorization: `Bearer ${token}`,},}
      );

      alert(review ? "Review updated!" : "Review added!");
      fetchMyReview();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-4">
      <h2>User Review</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Rating</th>
            <th>Review</th>
          </tr>
        </thead>

        <tbody>
          {review ? (
            <tr>
              <td>1</td>
              <td>{review.rating}</td>
              <td>{review.message}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No review found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <h4 className="mt-4">
        {review ? "Update Your Review" : "Add Review"}
      </h4>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Select value={rating} onChange={(e) => setRating(Number(e.target.value))} >{[1, 2, 3, 4, 5].map((num) => ( <option key={num} value={num}> {num} </option> ))}</Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Review</Form.Label>
          <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Group>

        <Button onClick={handleSubmit}> {review ? "Update Review" : "Submit Review"}</Button>
      </Form>
    </div>
  );
}

export default Userreview;
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Userreview() {
  const loggedInUser = { email: localStorage.getItem("userEmail") };
  const [reviews, setReviews] = useState([{ id: 1, name: "Steve", email: "steve@example.com", review: "Great product!" },{ id: 2, name: "Jacob", email: "jacob@example.com", review: "Nice quality." },]);
  const [newEmail, setNewEmail] = useState(loggedInUser.email || "");
  const [newReview, setNewReview] = useState("");
  const [show, setShow] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editReview, setEditReview] = useState("");

  const handleAddReview = () => {
    if (!loggedInUser.email) {
      return alert("Please login first");
    }

    if (!newReview) {
      return alert("Please enter review");
    }

    const newItem = {id: reviews.length + 1,name: loggedInUser.email.split("@")[0],email: loggedInUser.email,review: newReview,};

    setReviews([...reviews, newItem]);
    setNewReview("");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditEmail(item.email);
    setEditReview(item.review);
    setShow(true);
  };

  const handleSaveChanges = () => {
    if (editEmail !== loggedInUser.email) {
      return alert("You can only edit your own review");
    }

    const updated = reviews.map((r) => r.id === editingItem.id ? { ...r, name: editName, review: editReview } : r);
    setReviews(updated);
    setShow(false);
  };

  const userReviews = reviews.filter( (item) => item.email === loggedInUser.email);

  return (
    <div className="p-4">
      <h2 className="mb-3">User Reviews</h2>
      {!loggedInUser.email && (
        <p className="text-danger">Please login to see your reviews</p>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Review</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userReviews.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.review}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(item)}  > Edit</Button>
              </td>
            </tr>
          ))}

          {userReviews.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center"> No reviews found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <h4 className="mt-4">Add New Review</h4>
      <Form className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={loggedInUser.email || ""} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Review</Form.Label>
          <Form.Control as="textarea" rows={3} value={newReview} onChange={(e) => setNewReview(e.target.value)}/>
        </Form.Group>

        <Button variant="primary" onClick={handleAddReview}>Add Review</Button>
      </Form>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={editName} onChange={(e) => setEditName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={editEmail} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Review</Form.Label>
              <Form.Control as="textarea"  rows={3} value={editReview} onChange={(e) => setEditReview(e.target.value)}/>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}> Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Userreview;
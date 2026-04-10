import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function Productmanage() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [reviewShow, setReviewShow] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({ name: "",category: "vegetable",type: "locally-grown",pricePerKg: "",stockKg: "", originCountry: "Local",});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/viewitems");
      setItems(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("type", form.type);
      formData.append("pricePerKg", Number(form.pricePerKg));
      formData.append("stockKg", Number(form.stockKg));
      formData.append("originCountry", form.originCountry);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/additem", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchItems();
      setShow(false);
      setForm({name: "",category: "vegetable",type: "locally-grown",pricePerKg: "",stockKg: "",originCountry: "Local",});
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/deleteitem/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      setLoadingReviews(true);
      const res = await api.get(`/productreview/${productId}`);
      setReviews(res.data.data || []);
      setReviewShow(true);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await api.delete(`/deletereview/${reviewId}`);
      fetchReviews(selectedProduct._id);
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  return (
    <div className="p-4">
      <h2>Product Management</h2>

      <Button className="mb-3" onClick={() => setShow(true)}>Add Product</Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control name="name"  placeholder="Name" onChange={handleChange} className="mb-2"/>

            <Form.Select name="category" onChange={handleChange} className="mb-2">
              <option value="vegetable">Vegetable</option>
              <option value="fruit">Fruit</option>
            </Form.Select>

            <Form.Select name="type" onChange={handleChange} className="mb-2">
              <option value="locally-grown">Locally Grown</option>
              <option value="imported">Imported</option>
            </Form.Select>

            <Form.Control name="pricePerKg"  type="number" placeholder="Price per Kg" onChange={handleChange}  className="mb-2"/>

            <Form.Control name="stockKg" type="number" placeholder="Stock (Kg)" onChange={handleChange} className="mb-2"/>

            <Form.Control  name="originCountry" placeholder="Origin Country" onChange={handleChange} className="mb-2"/>

            <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="mb-3"/>

            {preview && (
              <div className="text-center">
                <Image src={preview} thumbnail style={{ maxHeight: "180px" }}/>
              </div>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Type</th>
            <th>Price/Kg</th>
            <th>Stock</th>
            <th>Origin</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>
                {item.image && (
                  <Image src={`http://localhost:3000/${item.image}`}  thumbnai style={{ width: "60px", height: "60px" }}/>
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.type}</td>
              <td>{item.pricePerKg}</td>
              <td>{item.stockKg}</td>
              <td>{item.originCountry}</td>
              <td>
                <Button variant="info" size="sm" className="me-2"
                  onClick={() => {
                    setSelectedProduct(item);
                    fetchReviews(item._id);
                  }}>View Reviews</Button>

                <Button variant="danger" size="sm" onClick={() => deleteItem(item._id)} >Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={reviewShow} onHide={() => setReviewShow(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title> Reviews  {selectedProduct?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loadingReviews ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted">No reviews found.</p>
          ) : (
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={review._id}>
                    <td>{index + 1}</td>
                    <td>{review.user_id?.name || "Anonymous"}</td>
                    <td>{review.rating} / 5</td>
                    <td>
                      {review.comment || (
                        <span className="text-muted">No comment</span>
                      )}
                    </td>
                    <td>
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      <Button variant="danger"  size="sm"  onClick={() =>  deleteReview(review._id)  } >Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setReviewShow(false)} > Close </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Productmanage;
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function OrderManage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const totalPages = Math.ceil(total / limit);

  const fetchOrders = async (pageNumber = 1) => {
    try {
      setError("");

      const res = await axiosInstance.get("/getallorders", {params: {page: pageNumber,limit,startDate: startDate || undefined,endDate: endDate || undefined,},});

      if (res.data.success) {
        setOrders(res.data.data);
        setTotal(res.data.total);
        setPage(res.data.page);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);


  const handleFilter = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setError("");
    setPage(1);

    fetchOrders(1);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setError("");
    setPage(1);

    fetchOrders(1);
  };

  const handleManageClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <Badge bg="success">Delivered</Badge>;

      case "confirmed":
        return <Badge bg="info">Confirmed</Badge>;

      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;

      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdatingStatus(true);
      setMessage("");
      setError("");

      const res = await axiosInstance.post("/updatestatus", { id: selectedOrder._id,orderStatus: selectedOrder.orderStatus,});

      if (res.data.success) {
        setMessage("Order status updated and email sent to user");
        fetchOrders(page);
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);

      setError("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      <Form className="mb-3">
        <Row className="g-2">
          <Col md={4}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
          </Col>
          <Col md={4}>
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Col>
          <Col
            md={4}
            className="d-flex align-items-end gap-2">
            <Button
              variant="primary"
              onClick={handleFilter}
            >
              Filter
            </Button>

            <Button
              variant="secondary"
              onClick={handleClearFilter}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>

      {/* TABLE */}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Placed By</th>
            <th>Status</th>
            <th>Delivered Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>

                <td>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString("en-IN")}
                </td>

                <td>
                  {order.userid?.name ||
                    order.userid?._id}
                </td>

                <td>
                  {getStatusBadge(
                    order.orderStatus
                  )}
                </td>

                <td>
                  {order.orderStatus ===
                    "delivered" &&
                  order.deliverdate
                    ? new Date(
                        order.deliverdate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </td>

                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      handleManageClick(order)
                    }
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center"
              >
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-end mt-3">
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          />

          {[...Array(totalPages)].map(
            (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === page}
                onClick={() =>
                  setPage(index + 1)
                }
              >
                {index + 1}
              </Pagination.Item>
            )
          )}

          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          />
        </Pagination>
      )}


      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Order Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <strong>Order ID:</strong>{" "}
                {selectedOrder._id}
              </p>

              <p>
                <strong>User:</strong>{" "}
                {selectedOrder.userid?.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedOrder.userid?.email}
              </p>

              <p>
                <strong>Item:</strong>{" "}
                {selectedOrder.itemid?.name}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {selectedOrder.itemcount}
              </p>

              <p>
                <strong>Price:</strong> ₹
                {selectedOrder.itemid?.price}
              </p>

              <p>
                <strong>Current Status:</strong>{" "}
                {getStatusBadge(
                  selectedOrder.orderStatus
                )}
              </p>

              {selectedOrder.orderStatus ===
                "delivered" &&
                selectedOrder.deliverdate && (
                  <p>
                    <strong>
                      Delivered Date:
                    </strong>{" "}
                    {new Date(
                      selectedOrder.deliverdate
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}

              <Form.Group className="mt-3">
                <Form.Label>
                  Change Status
                </Form.Label>

                <Form.Select
                  value={
                    selectedOrder.orderStatus
                  }
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      orderStatus:
                        e.target.value,
                    })
                  }
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleStatusUpdate}
            disabled={updatingStatus}
          >
            {updatingStatus
              ? "Updating..."
              : "Update Status"}
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              setShowModal(false)
            }
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderManage;
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function Adminorder() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalPages = Math.ceil(total / limit);

  const fetchOrders = async (pageNumber = 1) => {
    try {
      const res = await axiosInstance.get("/getallorders", {params: {page: pageNumber,limit,startDate,endDate,},
      });

      if (res.data.success) {
        setOrders(res.data.data);
        setTotal(res.data.total);
        setPage(res.data.page);
      }
    } catch (error) {
      console.error("Failed to fetch all orders", error);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const renderPagination = () => {
    let items = [];

    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number}active={number === page} onClick={() => setPage(number)}>{number} </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-end mt-3">
        <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)}/>{items}<Pagination.Next disabled={page === totalPages} onClick={() => setPage(page + 1)} /></Pagination>
    );
  };

  return (
    <>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
          </Col>
          <Col md={4}>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
          </Col>
          <Col md={4}>
            <Button onClick={() => fetchOrders(1)}>Filter</Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Placed By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>
                  {order.userid? order.userid.name || order.userid.email: "N/A"}</td>
                <td>
                  <Button variant="primary" size="sm">View</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No orders found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && renderPagination()}
    </>
  );
}

export default Adminorder;
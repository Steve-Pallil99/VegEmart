import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const Complaints = () => {
  const [myComplaints, setMyComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getToken = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Unauthorized - No token found");
      return null;
    }
    return token;
  };

  const getAllComplaints = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get( "http://localhost:3000/api/getallcomplaints", { headers: { Authorization: `Bearer ${token}`,}, });

      if (res.data.success) {
        setMyComplaints(res.data.data || []);
      } else {
        setError("Failed to fetch complaints");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, status) => {
    const token = getToken();
    if (!token) return;

    try {
      setError("");

      await axios.put( "http://localhost:3000/api/updateComplaintStatus", { complaintId, status }, {  headers: {  Authorization: `Bearer ${token}`, }, } );
      getAllComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    getAllComplaints();
  }, []);

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <h3 className="mb-3">My Complaints</h3>

      {loading ? (
        <p>Loading</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Category</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {myComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No complaints found
                </td>
              </tr>
            ) : (
              myComplaints.map((complaint, index) => (
                <tr key={complaint._id}>
                  <td>{index + 1}</td>
                  <td>{complaint?.orderid?._id || "N/A"}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.issue}</td>

                  <td>
                    <DropdownButton id={`status-${complaint._id}`} size="sm" variant="secondary"  title={complaint.status} > {["pending", "inreview", "completed"].map((s) => ( <Dropdown.Item key={s}  onClick={() =>    updateStatus(complaint._id, s)  } > {s}</Dropdown.Item> ))}</DropdownButton>
                  </td>

                  <td>
                    {complaint.createdAt ? new Date(  complaint.createdAt  ).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Complaints;
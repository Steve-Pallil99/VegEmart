import React, { useEffect, useState } from "react";
import axios from "axios";
import {LineChart,Line,XAxis,CartesianGrid,Tooltip,Legend,PieChart,Pie,Cell} from "recharts";
import { Badge, Card, Row, Col } from "react-bootstrap";

const COLORS = ["#0088FE", "#00C49F"];

function Admindashboard() {
  const [pieData, setPieData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [salesGrowth, setSalesGrowth] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);

  const [cardStats, setCardStats] = useState({totalUsers: 0,totalOrders: 0,totalProducts: 0,pendingOrders: 0,completedOrders: 0,totalRevenue: 0});
  const [dayGrowth, setDayGrowth] = useState({difference: 0,percentage: 0,trend: "nochange"});

  useEffect(() => {
    fetchSalesCard();
    fetchPieSales();
    fetchUserGrowth();
    fetchSalesGrowth();
    fetchDayGrowth(); 
  }, []);

  const fetchSalesCard = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/salescard");
      setCardStats(response.data.data);
    } catch (error) {
      console.error("Error fetching sales card data:", error);
    }
  };

  const fetchDayGrowth = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/daygrowth");
      setDayGrowth(response.data.data);
    } catch (error) {
      console.error("Error fetching day growth:", error);
    }
  };

  const fetchPieSales = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/piesales");
      const data = response.data.data;
      setPieData([{ name: "Imported Produce", value: data.imported?.totalRevenue || 0 },{ name: "Locally Grown Produce", value: data["locally-grown"]?.totalRevenue || 0 }]);
    } catch (error) {
      console.error("Error fetching pie sales:", error);
    }
  };

  const fetchUserGrowth = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usergrowth");
      const formatted = response.data.data.map(item => ({date: item._id,users: item.count}));
      setUserGrowth(formatted);
      setLoadingUsers(false);
    } catch (error) {
      setLoadingUsers(false);
    }
  };

  const fetchSalesGrowth = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/salesgrowth");
      const formatted = response.data.data.map(item => ({date: item._id.date,revenue: item.totalRevenue}));
      setSalesGrowth(formatted);
      setLoadingSales(false);
    } catch (error) {
      setLoadingSales(false);
    }
  };

  const formatCurrency = value =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(value);

  return (
    <div className="w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="col-span-1 lg:col-span-2 mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">VegEmart Admin Dashboard <Badge bg="success">Live</Badge></h1>
      </div>

      <div className="col-span-1 lg:col-span-2">
        <Row className="g-4">

          <Col md={4} lg={2}>
            <Card className="shadow text-center">
              <Card.Body>
                <Card.Title>Total Revenue</Card.Title>
                <h4 className="text-success">{formatCurrency(cardStats.totalRevenue)}</h4>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={2}>
            <Card className="shadow text-center">
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <h4>{cardStats.totalUsers}</h4>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={2}>
            <Card className="shadow text-center">
              <Card.Body>
                <Card.Title>Total Orders</Card.Title>
                <h4>{cardStats.totalOrders}</h4>
                {dayGrowth.trend === "increase" && (<p className="text-success mb-0">increase{Math.abs(dayGrowth.percentage)}% from yesterday</p>)}
                {dayGrowth.trend === "decrease" && (<p className="text-danger mb-0">decrease{Math.abs(dayGrowth.percentage)}% from yesterday</p>)}
                {dayGrowth.trend === "nochange" && (<p className="text-muted mb-0">No change from yesterday</p>)}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={2}>
            <Card className="shadow text-center">
              <Card.Body>
                <Card.Title>Total Products</Card.Title>
                <h4>{cardStats.totalProducts}</h4>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={2}>
            <Card className="shadow text-center">
              <Card.Body>
                <Card.Title>Pending Orders</Card.Title>
                <h4 className="text-warning">{cardStats.pendingOrders}</h4>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={2}>
            <Card className="shadow text-center">
              <Card.Body>
                <Card.Title>Completed Orders</Card.Title>
                <h4 className="text-primary">{cardStats.completedOrders}</h4>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </div>

      <div className="shadow-lg rounded-2xl p-6 bg-white flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">User Growth</h2>
        {loadingUsers ? (
          <p>Loading user data...</p>
        ) : (
          <LineChart width={500} height={300} data={userGrowth}><XAxis dataKey="date" /><Tooltip /><CartesianGrid stroke="#f5f5f5"/> <Legend/> <Line type="monotone" dataKey="users" stroke="#387908" strokeWidth={2} /></LineChart>
        )}
      </div>

      <div className="shadow-lg rounded-2xl p-6 bg-white flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Sales Over Time</h2>
        {loadingSales ? (
          <p>Loading sales data...</p>
        ) : (
          <LineChart width={500} height={300} data={salesGrowth}> <XAxis dataKey="date" /><Tooltip formatter={value => formatCurrency(value)} /> <CartesianGrid stroke="#f5f5f5" /><Legend/> <Line type="monotone" dataKey="revenue" stroke="#ff7300"  strokeWidth={2}/> </LineChart>
        )}
      </div>

      <div className="shadow-lg rounded-2xl p-6 bg-white flex flex-col items-center col-span-1 lg:col-span-2">
        <h2 className="text-xl font-semibold mb-2"> Imported vs Locally Grown Produce Sales</h2>
        <h3 className="text-lg font-bold text-green-600 mb-4"> Total Revenue: {formatCurrency(cardStats.totalRevenue)}</h3>

        <PieChart width={500} height={350}><Pie data={pieData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, value }) => `${name}: ${formatCurrency(value)}`  }>{pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}</Pie> <Tooltip formatter={value => formatCurrency(value)} /> <Legend /></PieChart>
      </div>
    </div>
  );
}

export default Admindashboard;
import React, { useEffect, useState } from 'react';
import { getRevenueStats } from '../../api/adminAPI';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaChartLine, FaMapMarkerAlt, FaCar, FaUser, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [rideAreaData, setRideAreaData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getRevenueStats();
        const {
          revenuePerDay = [],
          ridesPerArea = [],
          ridesPerDriver = [],
          ridesPerCustomer = []
        } = response.data;

        setRevenueData(revenuePerDay);
        setRideAreaData(ridesPerArea);
        setDriverData(ridesPerDriver);
        setCustomerData(ridesPerCustomer);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError('Failed to load revenue statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const renderChart = (data, title, icon, type = 'bar', height = 400) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-muted py-5">
          <FaExclamationTriangle size={32} className="mb-3" />
          <p className="mb-0">No data available for {title.toLowerCase()}.</p>
        </div>
      );
    }

    const ChartComponent = type === 'bar' ? BarChart : LineChart;
    const DataComponent = type === 'bar' ? Bar : Line;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={type === 'bar' && title.includes('Area') ? 'area' : 'date'}
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <YAxis stroke="#666" tick={{ fill: '#666' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <DataComponent
            type={type === 'bar' ? 'monotone' : 'monotone'}
            dataKey={type === 'bar' ? 'rides' : 'revenue'}
            stroke={type === 'bar' ? '#8884d8' : '#82ca9d'}
            fill={type === 'bar' ? '#8884d8' : '#82ca9d'}
            activeDot={{ r: 8 }}
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5">
          <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
            <FaChartLine size={24} />
          </div>
          <h1 className="h2 fw-bold mb-2">Revenue Analytics</h1>
          <p className="text-muted">View detailed revenue and ride statistics</p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
            <div className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              {error}
            </div>
          </Alert>
        )}

        <Row className="g-4">
          <Col md={12}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <FaMoneyBillWave size={20} />
                  </div>
                  <h2 className="h4 fw-bold mb-0">Revenue Per Day</h2>
                </div>
                {renderChart(revenueData, 'Revenue', FaMoneyBillWave, 'line')}
              </Card.Body>
            </Card>
          </Col>

          <Col md={12}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <h2 className="h4 fw-bold mb-0">Total Rides Per Area</h2>
                </div>
                {renderChart(rideAreaData, 'Area', FaMapMarkerAlt, 'bar', 500)}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <FaCar size={20} />
                  </div>
                  <h2 className="h4 fw-bold mb-0">Rides Per Driver</h2>
                </div>
                {renderChart(driverData, 'Driver', FaCar)}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <FaUser size={20} />
                  </div>
                  <h2 className="h4 fw-bold mb-0">Rides Per Customer</h2>
                </div>
                {renderChart(customerData, 'Customer', FaUser)}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>
        {`
          .card {
            transition: transform 0.2s ease-in-out;
          }
          .card:hover {
            transform: translateY(-5px);
          }
          .alert {
            transition: all 0.2s ease-in-out;
          }
          .alert:hover {
            transform: translateY(-2px);
          }
          .recharts-default-tooltip {
            background-color: rgba(255, 255, 255, 0.95) !important;
            border: 1px solid #dee2e6 !important;
            border-radius: 4px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }
          .recharts-tooltip-label {
            color: #666 !important;
            font-weight: 600 !important;
          }
          .recharts-tooltip-item {
            color: #666 !important;
          }
        `}
      </style>
    </div>
  );
};

export default RevenueChart;

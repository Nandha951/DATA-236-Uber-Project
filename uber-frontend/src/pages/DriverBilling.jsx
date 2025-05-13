import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBillingByDriver } from '../features/billing/billingThunks';
import { Container, Table, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaCreditCard, FaHistory, FaCheckCircle, FaTimesCircle, FaSpinner, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

const DriverBilling = () => {
  const dispatch = useDispatch();
  const { authDriver } = useSelector((state) => state.driver);
  const { driverBills, loading } = useSelector((state) => state.billing);

  useEffect(() => {
    if (authDriver?.driverId) {
      dispatch(fetchBillingByDriver(authDriver.driverId));
    }
  }, [dispatch, authDriver]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="text-success" />;
      case 'pending':
        return <FaSpinner className="text-warning" />;
      case 'failed':
        return <FaTimesCircle className="text-danger" />;
      default:
        return null;
    }
  };

  if (!authDriver) return <p>Please log in as a driver.</p>;
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="success" />
    </div>
  );

  const totalEarnings = driverBills.reduce((sum, bill) => sum + bill.actualPrice, 0);
  const completedRides = driverBills.filter(bill => bill.status.toLowerCase() === 'completed').length;
  const pendingRides = driverBills.filter(bill => bill.status.toLowerCase() === 'pending').length;

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <div className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FaCreditCard size={32} />
              </div>
              <h2 className="fw-bold mb-2">Billing Summary</h2>
              <p className="text-muted">Track your earnings and payment history</p>
            </div>

            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaMoneyBillWave className="text-success" size={24} />
                    </div>
                    <h3 className="fw-bold text-success mb-2">${totalEarnings.toFixed(2)}</h3>
                    <p className="text-muted mb-0">Total Earnings</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaCheckCircle className="text-success" size={24} />
                    </div>
                    <h3 className="fw-bold text-success mb-2">{completedRides}</h3>
                    <p className="text-muted mb-0">Completed Rides</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaSpinner className="text-warning" size={24} />
                    </div>
                    <h3 className="fw-bold text-warning mb-2">{pendingRides}</h3>
                    <p className="text-muted mb-0">Pending Rides</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {driverBills.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <FaHistory size={48} className="text-muted mb-3" />
                  <h4 className="text-muted">No billing records yet</h4>
                  <p className="text-muted mb-0">Your ride payment history will appear here</p>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Billing ID</th>
                          <th>Ride ID</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {driverBills.map((bill) => (
                          <tr key={bill.billingId}>
                            <td className="align-middle">#{bill.billingId}</td>
                            <td className="align-middle">#{bill.rideId}</td>
                            <td className="align-middle">
                              <span className="d-flex align-items-center text-muted">
                                <FaCalendarAlt className="me-2" size={14} />
                                {new Date(bill.date).toLocaleString()}
                              </span>
                            </td>
                            <td className="align-middle">
                              <span className="d-flex align-items-center fw-bold text-success">
                                <FaMoneyBillWave className="me-2" size={14} />
                                ${bill.actualPrice.toFixed(2)}
                              </span>
                            </td>
                            <td className="align-middle">
                              <span className="d-flex align-items-center gap-2">
                                {getStatusIcon(bill.status)}
                                <span className="text-capitalize">{bill.status}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <style>
        {`
          .table th {
            font-weight: 600;
            border-top: none;
          }
          .table td {
            vertical-align: middle;
          }
          .card {
            transition: transform 0.2s ease-in-out;
          }
          .card:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
    </div>
  );
};

export default DriverBilling;

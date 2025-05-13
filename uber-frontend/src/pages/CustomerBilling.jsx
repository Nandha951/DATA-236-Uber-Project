import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBillingByCustomer } from '../features/billing/billingThunks';
import { Container, Table, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaCreditCard, FaHistory, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const CustomerBilling = () => {
  const dispatch = useDispatch();
  const { authCustomer } = useSelector((state) => state.customer);
  const { customerBills, loading } = useSelector((state) => state.billing);

  useEffect(() => {
    if (authCustomer?.customerId) {
      dispatch(fetchBillingByCustomer(authCustomer.customerId));
    }
  }, [dispatch, authCustomer]);

  if (!authCustomer) return <p>Please log in as a customer.</p>;
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="primary" />
    </div>
  );

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

  const totalSpent = customerBills.reduce((sum, bill) => sum + bill.actualPrice, 0);
  const completedRides = customerBills.filter(bill => bill.status.toLowerCase() === 'completed').length;

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FaCreditCard size={32} />
              </div>
              <h2 className="fw-bold mb-2">Billing History</h2>
              <p className="text-muted">Track your ride payments and expenses</p>
            </div>

            <Row className="g-4 mb-4">
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <h3 className="fw-bold text-primary mb-2">${totalSpent.toFixed(2)}</h3>
                    <p className="text-muted mb-0">Total Spent</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <h3 className="fw-bold text-success mb-2">{completedRides}</h3>
                    <p className="text-muted mb-0">Completed Rides</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {customerBills.length === 0 ? (
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
                          <th>Driver ID</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerBills.map((bill) => (
                          <tr key={bill.billingId}>
                            <td className="align-middle">#{bill.billingId}</td>
                            <td className="align-middle">#{bill.driverId}</td>
                            <td className="align-middle">
                              {new Date(bill.date).toLocaleDateString()}
                            </td>
                            <td className="align-middle fw-bold">
                              ${bill.actualPrice.toFixed(2)}
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

export default CustomerBilling;

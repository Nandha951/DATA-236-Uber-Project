import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDriverSummary } from '../features/driver/driverThunks';
import { useParams } from 'react-router-dom';
import { Container, Table, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaCar, FaMoneyBillWave, FaCheckCircle, FaHistory, FaChartLine } from 'react-icons/fa';

const DriverSummary = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { summary, loading } = useSelector((state) => state.driver);

  useEffect(() => {
    dispatch(getDriverSummary(id));
  }, [dispatch, id]);

  if (loading || !summary) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="success" />
    </div>
  );

  const { totalRides, completedRides, totalEarnings, rideHistory } = summary;

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <div className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FaCar size={32} />
              </div>
              <h2 className="fw-bold mb-2">Driver Summary</h2>
              <p className="text-muted">Track your performance and earnings</p>
            </div>

            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaHistory className="text-success" size={24} />
                    </div>
                    <h3 className="fw-bold text-success mb-2">{totalRides}</h3>
                    <p className="text-muted mb-0">Total Rides</p>
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
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaMoneyBillWave className="text-success" size={24} />
                    </div>
                    <h3 className="fw-bold text-success mb-2">${totalEarnings.toFixed(2)}</h3>
                    <p className="text-muted mb-0">Total Earnings</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h4 className="mb-0">
                  <FaChartLine className="text-success me-2" />
                  Recent Rides
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Ride ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Fare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rideHistory.map((ride) => (
                        <tr key={ride.rideId}>
                          <td className="align-middle">#{ride.rideId}</td>
                          <td className="align-middle">
                            {new Date(ride.date).toLocaleString()}
                          </td>
                          <td className="align-middle">
                            <span className={`badge bg-${ride.status === 'completed' ? 'success' : 'warning'} bg-opacity-10 text-${ride.status === 'completed' ? 'success' : 'warning'}`}>
                              {ride.status}
                            </span>
                          </td>
                          <td className="align-middle fw-bold">
                            ${(ride.fare || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h4 className="mb-0">
                  <FaMoneyBillWave className="text-success me-2" />
                  Billing History
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Billing ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.billingHistory?.map((bill) => (
                        <tr key={bill.billingId}>
                          <td className="align-middle">#{bill.billingId}</td>
                          <td className="align-middle">
                            {new Date(bill.date).toLocaleString()}
                          </td>
                          <td className="align-middle fw-bold">
                            ${bill.amount.toFixed(2)}
                          </td>
                          <td className="align-middle">
                            <span className={`badge bg-${bill.status === 'paid' ? 'success' : 'warning'} bg-opacity-10 text-${bill.status === 'paid' ? 'success' : 'warning'}`}>
                              {bill.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
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
        .badge {
          padding: 0.5em 1em;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default DriverSummary;

// src/features/admin/ReviewDriver.jsx
import React, { useEffect, useState } from 'react';
import { getAllDrivers } from '../../api/driverAPI';
import { Container, Row, Col, Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaCar, FaUser, FaEnvelope, FaPhone, FaIdCard, FaStar } from 'react-icons/fa';

const ReviewDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getAllDrivers();
        setDrivers(data);
      } catch (err) {
        console.error("Failed to fetch drivers", err);
        setError("Failed to load drivers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const renderRating = (rating) => {
    if (!rating) return <Badge bg="secondary">N/A</Badge>;
    return (
      <div className="d-flex align-items-center">
        <FaStar className="text-warning me-1" />
        <span className="fw-bold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={12} lg={10}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FaCar size={24} />
                  </div>
                  <h2 className="h3 fw-bold mb-2">Driver Accounts</h2>
                  <p className="text-muted">Review and manage driver accounts</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                    <div className="d-flex align-items-center">
                      <FaCar className="me-2" />
                      {error}
                    </div>
                  </Alert>
                )}

                {drivers.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FaCar size={48} className="mb-3" />
                    <p className="mb-0">No drivers found in the system.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0">
                            <div className="d-flex align-items-center">
                              <FaIdCard className="me-2 text-primary" />
                              ID
                            </div>
                          </th>
                          <th className="border-0">
                            <div className="d-flex align-items-center">
                              <FaUser className="me-2 text-primary" />
                              Name
                            </div>
                          </th>
                          <th className="border-0">
                            <div className="d-flex align-items-center">
                              <FaEnvelope className="me-2 text-primary" />
                              Email
                            </div>
                          </th>
                          <th className="border-0">
                            <div className="d-flex align-items-center">
                              <FaPhone className="me-2 text-primary" />
                              Phone
                            </div>
                          </th>
                          <th className="border-0">
                            <div className="d-flex align-items-center">
                              <FaStar className="me-2 text-primary" />
                              Rating
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {drivers.map((driver) => (
                          <tr key={driver._id}>
                            <td className="border-0">
                              <small className="text-muted">{driver._id}</small>
                            </td>
                            <td className="border-0">
                              <div className="fw-bold">
                                {driver.firstName} {driver.lastName}
                              </div>
                            </td>
                            <td className="border-0">
                              <div className="d-flex align-items-center">
                                <FaEnvelope className="me-2 text-muted" size={14} />
                                {driver.email}
                              </div>
                            </td>
                            <td className="border-0">
                              <div className="d-flex align-items-center">
                                <FaPhone className="me-2 text-muted" size={14} />
                                {driver.phoneNumber}
                              </div>
                            </td>
                            <td className="border-0">
                              {renderRating(driver.rating)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
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
          .table > :not(caption) > * > * {
            padding: 1rem;
          }
          .table tbody tr {
            transition: all 0.2s ease-in-out;
          }
          .table tbody tr:hover {
            background-color: rgba(13, 110, 253, 0.05);
            transform: translateX(5px);
          }
          .alert {
            transition: all 0.2s ease-in-out;
          }
          .alert:hover {
            transform: translateY(-2px);
          }
          .badge {
            font-size: 0.875rem;
            padding: 0.5em 0.75em;
          }
        `}
      </style>
    </div>
  );
};

export default ReviewDriver;

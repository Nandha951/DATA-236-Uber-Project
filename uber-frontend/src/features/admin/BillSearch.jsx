import React, { useState } from 'react';
import { searchBills, getBillDetails } from '../../api/adminAPI';
import { Container, Row, Col, Card, Form, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaReceipt, FaUser, FaCar, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const BillSearch = () => {
  const [query, setQuery] = useState({ customerId: '', rideId: '', date: '' });
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setSelectedBill(null);

    try {
      const response = await searchBills(query);
      setBills(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError('Failed to fetch bills. Please try again.');
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillClick = async (billId) => {
    setLoading(true);
    setError('');

    try {
      const response = await getBillDetails(billId);
      setSelectedBill(response.data);
    } catch (error) {
      setError('Failed to fetch bill details. Please try again.');
      console.error('Error fetching bill details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FaSearch size={24} />
                  </div>
                  <h2 className="h3 fw-bold mb-2">Search Bills</h2>
                  <p className="text-muted">Search for bills by customer ID, ride ID, or date</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                    <div className="d-flex align-items-center">
                      <FaMoneyBillWave className="me-2" />
                      {error}
                    </div>
                  </Alert>
                )}

                <Form className="mb-4">
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="text-muted">
                          <FaUser className="me-2" />
                          Customer ID
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="customerId"
                          value={query.customerId}
                          onChange={handleChange}
                          placeholder="Enter customer ID"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="text-muted">
                          <FaCar className="me-2" />
                          Ride ID
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="rideId"
                          value={query.rideId}
                          onChange={handleChange}
                          placeholder="Enter ride ID"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="text-muted">
                          <FaCalendarAlt className="me-2" />
                          Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={query.date}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid gap-2 mt-4">
                    <Button
                      variant="primary"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch className="me-2" />
                          Search Bills
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                {bills.length > 0 && (
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h3 className="h5 fw-bold mb-3">
                        <FaReceipt className="me-2" />
                        Search Results
                      </h3>
                      <ListGroup>
                        {bills.map((bill) => (
                          <ListGroup.Item
                            key={bill._id}
                            action
                            onClick={() => handleBillClick(bill._id)}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <span className="fw-bold">Bill ID:</span> {bill._id}
                            </div>
                            <div className="text-muted">
                              <small>
                                Ride: {bill.rideId} | Customer: {bill.customerId}
                              </small>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                )}

                {bills.length === 0 && !loading && (
                  <div className="text-center text-muted py-4">
                    <FaReceipt size={32} className="mb-3" />
                    <p className="mb-0">No bills found. Try different search criteria.</p>
                  </div>
                )}

                {selectedBill && (
                  <Card className="mt-4 border-0 bg-light">
                    <Card.Body>
                      <h3 className="h5 fw-bold mb-3">
                        <FaMoneyBillWave className="me-2" />
                        Bill Details
                      </h3>
                      <div className="bg-white p-3 rounded">
                        <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(selectedBill, null, 2)}
                        </pre>
                      </div>
                    </Card.Body>
                  </Card>
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
          .btn {
            transition: all 0.2s ease-in-out;
          }
          .btn:hover:not(:disabled) {
            transform: translateY(-2px);
          }
          .list-group-item {
            transition: all 0.2s ease-in-out;
          }
          .list-group-item:hover {
            background-color: #f8f9fa;
            transform: translateX(5px);
          }
          .form-control:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }
        `}
      </style>
    </div>
  );
};

export default BillSearch;

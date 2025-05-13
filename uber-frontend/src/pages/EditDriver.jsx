import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverById, updateDriver } from '../features/driver/driverThunks';
import { clearSelectedDriver } from '../features/driver/driverSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaSave, FaArrowLeft } from 'react-icons/fa';

const EditDriver = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedDriver, loading } = useSelector((state) => state.driver);
  const [form, setForm] = useState(null);

  useEffect(() => {
    dispatch(fetchDriverById(id));
    return () => dispatch(clearSelectedDriver());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedDriver) {
      setForm({
        name: selectedDriver.name,
        email: selectedDriver.email,
        phone: selectedDriver.phone,
        licenseNumber: selectedDriver.licenseNumber
      });
    }
  }, [selectedDriver]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDriver({ id, data: form }))
      .unwrap()
      .then(() => {
        alert('Driver updated successfully!');
        navigate('/drivers');
      })
      .catch(err => {
        alert('Failed to update driver: ' + (err?.message || 'Unknown error'));
      });
  };

  if (loading || !form) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUser size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Edit Driver</h2>
                  <p className="text-muted">Update driver information</p>
                </div>

                <Form onSubmit={handleSubmit} className="needs-validation">
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaUser className="me-2" />
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaEnvelope className="me-2" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter email address"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaPhone className="me-2" />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          placeholder="Enter phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaIdCard className="me-2" />
                          License Number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="licenseNumber"
                          value={form.licenseNumber}
                          onChange={handleChange}
                          required
                          placeholder="Enter license number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 justify-content-center mt-4">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="px-4"
                      onClick={() => navigate('/drivers')}
                    >
                      <FaArrowLeft className="me-2" />
                      Back to List
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="px-4"
                    >
                      <FaSave className="me-2" />
                      Save Changes
                    </Button>
                  </div>
                </Form>
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
          .btn:hover {
            transform: translateY(-2px);
          }
          .form-control:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }
        `}
      </style>
    </div>
  );
};

export default EditDriver;

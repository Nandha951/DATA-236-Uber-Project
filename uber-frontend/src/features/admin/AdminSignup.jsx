import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignup } from '../../api/adminAPI';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaUserShield, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCity, FaBuilding, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    adminId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminSignup(formData);
      setSuccess('Admin account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUserShield size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Admin Registration</h2>
                  <p className="text-muted">Create your admin account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                    <div className="d-flex align-items-center">
                      <FaUserShield className="me-2" />
                      {error}
                    </div>
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="mb-4">
                    <div className="d-flex align-items-center">
                      <FaUserShield className="me-2" />
                      {success}
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="needs-validation">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaUser className="me-2" />
                          Admin ID
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="adminId"
                          value={formData.adminId}
                          onChange={handleChange}
                          required
                          placeholder="Enter admin ID"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaEnvelope className="me-2" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter email address"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaUser className="me-2" />
                          First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="Enter first name"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaUser className="me-2" />
                          Last Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Enter last name"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaLock className="me-2" />
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Enter password"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaPhone className="me-2" />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          placeholder="Enter phone number"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-muted">
                      <FaMapMarkerAlt className="me-2" />
                      Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter street address"
                      disabled={loading}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaCity className="me-2" />
                          City
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          placeholder="Enter city"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaBuilding className="me-2" />
                          State
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          placeholder="Enter state"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                          <FaMapMarkerAlt className="me-2" />
                          ZIP Code
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          placeholder="Enter ZIP code"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      variant="outline-primary"
                      className="flex-grow-1"
                      onClick={() => navigate('/admin/login')}
                      disabled={loading}
                    >
                      <FaArrowLeft className="me-2" />
                      Back to Login
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-grow-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <FaSignInAlt className="me-2" />
                          Create Account
                        </>
                      )}
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
          .btn:hover:not(:disabled) {
            transform: translateY(-2px);
          }
          .form-control:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }
          .alert {
            transition: all 0.2s ease-in-out;
          }
          .alert:hover {
            transform: translateY(-2px);
          }
        `}
      </style>
    </div>
  );
};

export default AdminSignup; 
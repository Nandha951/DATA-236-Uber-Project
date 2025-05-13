import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCustomerByAdmin } from '../../api/adminAPI';
import { Form, Button, Container, Card, Row, Col, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { FaUser, FaCreditCard, FaLock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaIdCard, FaUserPlus } from 'react-icons/fa';

const AddCustomerByAdmin = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [form, setForm] = useState({
    customerId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    creditCard: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolderName: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addCustomerByAdmin(form);
      setSuccess('Customer added successfully!');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <h4 className="mb-4">Personal Information</h4>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaIdCard className="me-2" />
          SSN/ID Number
        </Form.Label>
        <Form.Control
          type="text"
          name="customerId"
          value={form.customerId}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
              if (value.length <= 3) {
                value = value;
              } else if (value.length <= 5) {
                value = value.slice(0, 3) + '-' + value.slice(3);
              } else {
                value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 9);
              }
            }
            handleChange({ target: { name: 'customerId', value } });
          }}
          required
          className="form-control-lg"
          placeholder="XXX-XX-XXXX"
          maxLength={11}
          pattern="^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$"
          title="Please enter a valid SSN in the format XXX-XX-XXXX"
          disabled={loading}
        />
        <Form.Text className="text-muted">
          Enter your SSN in the format XXX-XX-XXXX
        </Form.Text>
      </Form.Group>
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
              value={form.firstName}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Enter your first name"
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
              value={form.lastName}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Enter your last name"
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaEnvelope className="me-2" />
          Email Address
        </Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-control-lg"
          placeholder="Enter your email"
          disabled={loading}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaPhone className="me-2" />
          Phone Number
        </Form.Label>
        <Form.Control
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          className="form-control-lg"
          placeholder="Enter your phone number"
          disabled={loading}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaLock className="me-2" />
          Password
        </Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="form-control-lg"
          placeholder="Create a password"
          disabled={loading}
        />
      </Form.Group>
    </>
  );

  const renderStep2 = () => (
    <>
      <h4 className="mb-4">Address Information</h4>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaMapMarkerAlt className="me-2" />
          Street Address
        </Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="form-control-lg"
          placeholder="Enter your street address"
          disabled={loading}
        />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Enter your city"
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="State"
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">ZIP Code</Form.Label>
            <Form.Control
              type="text"
              name="zipCode"
              value={form.zipCode}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="ZIP"
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );

  const renderStep3 = () => (
    <>
      <h4 className="mb-4">Payment Information</h4>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaCreditCard className="me-2" />
          Card Holder Name
        </Form.Label>
        <Form.Control
          type="text"
          name="creditCard.cardHolderName"
          value={form.creditCard.cardHolderName}
          onChange={handleChange}
          required
          className="form-control-lg"
          placeholder="Name on card"
          disabled={loading}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaCreditCard className="me-2" />
          Card Number
        </Form.Label>
        <Form.Control
          type="text"
          name="creditCard.cardNumber"
          value={form.creditCard.cardNumber}
          onChange={handleChange}
          required
          className="form-control-lg"
          placeholder="1234 5678 9012 3456"
          disabled={loading}
        />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Expiry Date</Form.Label>
            <Form.Control
              type="text"
              name="creditCard.expiryDate"
              value={form.creditCard.expiryDate}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="MM/YY"
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">CVV</Form.Label>
            <Form.Control
              type="text"
              name="creditCard.cvv"
              value={form.creditCard.cvv}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="123"
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );

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
                  <FaUserPlus size={48} className="text-primary mb-3" />
                  <h2 className="fw-bold">Add Customer</h2>
                  <p className="text-muted">Register a new customer</p>
                </div>
                <ProgressBar
                  now={(step / totalSteps) * 100}
                  className="mb-4"
                  variant="primary"
                  style={{ height: '0.5rem' }}
                />
                {error && (
                  <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="mb-4">
                    {success}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit} className="needs-validation">
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  <div className="d-flex justify-content-between mt-4">
                    {step > 1 && (
                      <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={() => setStep(step - 1)}
                        disabled={loading}
                      >
                        Previous
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className={step === 1 ? "w-100" : ""}
                      disabled={loading}
                    >
                      {step === totalSteps ? (loading ? 'Adding...' : 'Add Customer') : 'Next'}
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
          .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
          }
          .btn-link:hover {
            color: #0d6efd !important;
          }
          .progress {
            height: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export default AddCustomerByAdmin;
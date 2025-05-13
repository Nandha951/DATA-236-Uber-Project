import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { signupDriver } from '../features/driver/driverThunks';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaUser, FaLock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaIdCard, FaShieldAlt } from 'react-icons/fa';

const DriverSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [form, setForm] = useState({
    driverId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseExpiry: '',
    carDetails: {
      make: '',
      model: '',
      year: '',
      color: '',
      licensePlate: ''
    },
    insuranceDetails: {
      provider: '',
      policyNumber: '',
      expiryDate: ''
    },
    currentLocation: {
      latitude: '',
      longitude: '',
      address: ''
    }
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    const fixedForm = {
      ...form,
      currentLocation: {
        latitude: parseFloat(form.currentLocation.latitude),
        longitude: parseFloat(form.currentLocation.longitude),
        address: form.currentLocation.address
      },
      carDetails: {
        ...form.carDetails,
        year: parseInt(form.carDetails.year)
      },
      licenseExpiry: form.licenseExpiry,
insuranceDetails: {
  ...form.insuranceDetails,
  expiryDate: form.insuranceDetails.expiryDate
}
    };

    dispatch(signupDriver(fixedForm)).then(() => {
      alert('Signup successful! Please login.');
      navigate('/drivers/login');
    });
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
          name="driverId"
          value={form.driverId}
          onChange={(e) => {
            // Format SSN as user types (XXX-XX-XXXX)
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
            handleChange({ target: { name: 'driverId', value } });
          }}
          required
          className="form-control-lg"
          placeholder="XXX-XX-XXXX"
          maxLength={11}
          pattern="^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$"
          title="Please enter a valid SSN in the format XXX-XX-XXXX"
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
        />
      </Form.Group>
    </>
  );

  const renderStep2 = () => (
    <>
      <h4 className="mb-4">Address & License Information</h4>
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
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">
              <FaIdCard className="me-2" />
              License Number
            </Form.Label>
            <Form.Control
              type="text"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Enter your license number"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">License Expiry</Form.Label>
            <Form.Control
              type="date"
              name="licenseExpiry"
              value={form.licenseExpiry}
              onChange={handleChange}
              required
              className="form-control-lg"
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );

  const renderStep3 = () => (
    <>
      <h4 className="mb-4">Vehicle Information</h4>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">
              <FaCar className="me-2" />
              Make
            </Form.Label>
            <Form.Control
              type="text"
              name="carDetails.make"
              value={form.carDetails.make}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Car make"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">
              <FaCar className="me-2" />
              Model
            </Form.Label>
            <Form.Control
              type="text"
              name="carDetails.model"
              value={form.carDetails.model}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Car model"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Year</Form.Label>
            <Form.Control
              type="number"
              name="carDetails.year"
              value={form.carDetails.year}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Year"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Color</Form.Label>
            <Form.Control
              type="text"
              name="carDetails.color"
              value={form.carDetails.color}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Color"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">License Plate</Form.Label>
            <Form.Control
              type="text"
              name="carDetails.licensePlate"
              value={form.carDetails.licensePlate}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="License plate"
            />
          </Form.Group>
        </Col>
      </Row>

      <h5 className="mt-4 mb-3">Insurance Details</h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">
              <FaShieldAlt className="me-2" />
              Provider
            </Form.Label>
            <Form.Control
              type="text"
              name="insuranceDetails.provider"
              value={form.insuranceDetails.provider}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Insurance provider"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Policy Number</Form.Label>
            <Form.Control
              type="text"
              name="insuranceDetails.policyNumber"
              value={form.insuranceDetails.policyNumber}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Policy number"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label className="text-muted">Insurance Expiry</Form.Label>
        <Form.Control
          type="date"
          name="insuranceDetails.expiryDate"
          value={form.insuranceDetails.expiryDate}
          onChange={handleChange}
          required
          className="form-control-lg"
        />
      </Form.Group>
    </>
  );

  const renderStep4 = () => (
    <>
      <h4 className="mb-4">Current Location</h4>
      <Form.Group className="mb-3">
        <Form.Label className="text-muted">
          <FaMapMarkerAlt className="me-2" />
          Address
        </Form.Label>
        <Form.Control
          type="text"
          name="currentLocation.address"
          value={form.currentLocation.address}
          onChange={handleChange}
          required
          className="form-control-lg"
          placeholder="Enter your current location"
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Latitude</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="currentLocation.latitude"
              value={form.currentLocation.latitude}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Enter latitude"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Longitude</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="currentLocation.longitude"
              value={form.currentLocation.longitude}
              onChange={handleChange}
              required
              className="form-control-lg"
              placeholder="Enter longitude"
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <FaCar size={48} className="text-success mb-3" />
                  <h2 className="fw-bold">Become a Driver</h2>
                  <p className="text-muted">Join our network of professional drivers</p>
                </div>

                <ProgressBar 
                  now={(step / totalSteps) * 100} 
                  className="mb-4" 
                  variant="success"
                  style={{ height: '0.5rem' }}
                />

                <Form onSubmit={handleSubmit} className="needs-validation">
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}

                  <div className="d-flex justify-content-between mt-4">
                    {step > 1 && (
                      <Button
                        variant="outline-success"
                        size="lg"
                        onClick={() => setStep(step - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      className={step === 1 ? "w-100" : ""}
                    >
                      {step === totalSteps ? "Create Account" : "Next"}
                    </Button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Already a driver?{' '}
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => navigate('/drivers/login')}
                        style={{ color: '#198754' }}
                        onMouseOver={(e) => e.target.style.color = '#146c43'}
                        onMouseOut={(e) => e.target.style.color = '#198754'}
                      >
                        Sign in here
                      </Button>
                    </p>
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
            box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15);
          }
          .btn-link:hover {
            color: #198754 !important;
          }
        `}
      </style>
    </div>
  );
};

export default DriverSignup;
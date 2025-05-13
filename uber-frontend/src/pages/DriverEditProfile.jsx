import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDriver } from '../features/driver/driverThunks';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCar, FaShieldAlt, FaMapMarkerAlt, FaSave, FaArrowLeft } from 'react-icons/fa';

const DriverEditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authDriver, loading } = useSelector((state) => state.driver);

  const [form, setForm] = useState({
    driverId: authDriver?.driverId || '',
    firstName: authDriver?.firstName || '',
    lastName: authDriver?.lastName || '',
    email: authDriver?.email || '',
    password: '',
    address: authDriver?.address || '',
    city: authDriver?.city || '',
    state: authDriver?.state || '',
    zipCode: authDriver?.zipCode || '',
    phoneNumber: authDriver?.phoneNumber || '',
    licenseNumber: authDriver?.licenseNumber || '',
    licenseExpiry: authDriver?.licenseExpiry?.split('T')[0] || '',
    carDetails: {
      make: authDriver?.carDetails?.make || '',
      model: authDriver?.carDetails?.model || '',
      year: authDriver?.carDetails?.year || '',
      color: authDriver?.carDetails?.color || '',
      licensePlate: authDriver?.carDetails?.licensePlate || ''
    },
    insuranceDetails: {
      provider: authDriver?.insuranceDetails?.provider || '',
      policyNumber: authDriver?.insuranceDetails?.policyNumber || '',
      expiryDate: authDriver?.insuranceDetails?.expiryDate?.split('T')[0] || ''
    },
    currentLocation: {
      latitude: authDriver?.currentLocation?.latitude || '',
      longitude: authDriver?.currentLocation?.longitude || '',
      address: authDriver?.currentLocation?.address || ''
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
    const fixedForm = {
      ...form,
      carDetails: {
        ...form.carDetails,
        year: parseInt(form.carDetails.year)
      },
      licenseExpiry: form.licenseExpiry,
      insuranceDetails: {
        ...form.insuranceDetails,
        expiryDate: form.insuranceDetails.expiryDate
      },
      currentLocation: {
        latitude: parseFloat(form.currentLocation.latitude),
        longitude: parseFloat(form.currentLocation.longitude),
        address: form.currentLocation.address
      }
    };

     // Remove password if it's empty
     if (!fixedForm.password) {
      delete fixedForm.password;
    }


    dispatch(updateDriver({ id: form.driverId, data: fixedForm }))
      .unwrap()
      .then(() => {
        alert('Profile updated successfully!');
        navigate(`/drivers/${form.driverId}/profile`);
      })
      .catch(err => {
        alert('Failed to update profile: ' + (err?.message || 'Unknown error'));
      });
  };

  if (loading || !authDriver) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="success" />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUser size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Edit Profile</h2>
                  <p className="text-muted">Update your driver information</p>
                </div>

                <Form onSubmit={handleSubmit} className="needs-validation">
                  <h5 className="fw-bold mb-3">
                    <FaUser className="text-success me-2" />
                    Personal Information
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaUser className="me-2" />
                          First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          placeholder="Enter first name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaUser className="me-2" />
                          Last Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Enter last name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
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
                      <Form.Group>
                        <Form.Label>
                          <FaPhone className="me-2" />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          required
                          placeholder="Enter phone number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="fw-bold mb-3">
                    <FaMapMarkerAlt className="text-success me-2" />
                    Address Information
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          <FaMapMarkerAlt className="me-2" />
                          Street Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          required
                          placeholder="Enter street address"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          required
                          placeholder="Enter city"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          required
                          placeholder="Enter state"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>ZIP Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={form.zipCode}
                          onChange={handleChange}
                          required
                          placeholder="Enter ZIP code"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="fw-bold mb-3">
                    <FaIdCard className="text-success me-2" />
                    License Information
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Form.Group>
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
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaIdCard className="me-2" />
                          License Expiry
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="licenseExpiry"
                          value={form.licenseExpiry}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="fw-bold mb-3">
                    <FaCar className="text-success me-2" />
                    Vehicle Information
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Make</Form.Label>
                        <Form.Control
                          type="text"
                          name="carDetails.make"
                          value={form.carDetails.make}
                          onChange={handleChange}
                          required
                          placeholder="Enter car make"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Model</Form.Label>
                        <Form.Control
                          type="text"
                          name="carDetails.model"
                          value={form.carDetails.model}
                          onChange={handleChange}
                          required
                          placeholder="Enter car model"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                          type="number"
                          name="carDetails.year"
                          value={form.carDetails.year}
                          onChange={handleChange}
                          required
                          placeholder="Enter car year"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                          type="text"
                          name="carDetails.color"
                          value={form.carDetails.color}
                          onChange={handleChange}
                          required
                          placeholder="Enter car color"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>License Plate</Form.Label>
                        <Form.Control
                          type="text"
                          name="carDetails.licensePlate"
                          value={form.carDetails.licensePlate}
                          onChange={handleChange}
                          required
                          placeholder="Enter license plate"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="fw-bold mb-3">
                    <FaShieldAlt className="text-success me-2" />
                    Insurance Information
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaShieldAlt className="me-2" />
                          Provider
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="insuranceDetails.provider"
                          value={form.insuranceDetails.provider}
                          onChange={handleChange}
                          required
                          placeholder="Enter insurance provider"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaShieldAlt className="me-2" />
                          Policy Number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="insuranceDetails.policyNumber"
                          value={form.insuranceDetails.policyNumber}
                          onChange={handleChange}
                          required
                          placeholder="Enter policy number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          <FaShieldAlt className="me-2" />
                          Expiry Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="insuranceDetails.expiryDate"
                          value={form.insuranceDetails.expiryDate}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="fw-bold mb-3">
                    <FaMapMarkerAlt className="text-success me-2" />
                    Current Location
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                          type="number"
                          step="any"
                          name="currentLocation.latitude"
                          value={form.currentLocation.latitude}
                          onChange={handleChange}
                          required
                          placeholder="Enter latitude"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                          type="number"
                          step="any"
                          name="currentLocation.longitude"
                          value={form.currentLocation.longitude}
                          onChange={handleChange}
                          required
                          placeholder="Enter longitude"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="currentLocation.address"
                          value={form.currentLocation.address}
                          onChange={handleChange}
                          required
                          placeholder="Enter current address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 justify-content-center mt-4">
                    <Button
                      variant="outline-success"
                      size="lg"
                      className="px-4"
                      onClick={() => navigate(`/drivers/${form.driverId}/profile`)}
                    >
                      <FaArrowLeft className="me-2" />
                      Back to Profile
                    </Button>
                    <Button
                      type="submit"
                      variant="success"
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
            box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.15);
          }
          h5 {
            color: #198754;
            border-bottom: 2px solid rgba(25, 135, 84, 0.1);
            padding-bottom: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export default DriverEditProfile;

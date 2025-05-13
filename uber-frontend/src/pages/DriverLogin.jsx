import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loginDriver } from '../features/driver/driverThunks';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const DriverLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await dispatch(loginDriver(form)).unwrap();
      const driverId = result?.driver?.driverId;
      if (driverId) {
        navigate(`/drivers/${driverId}/summary`);
      } else {
        setError('Invalid login credentials');
      }
    } catch (err) {
      setError(err?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="success" />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaCar size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Driver Portal</h2>
                  <p className="text-muted">Sign in to your driver account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                    <div className="d-flex align-items-center">
                      <FaCar className="me-2" />
                      {error}
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="needs-validation">
                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted">
                      <FaCar className="me-2" />
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

                  <Form.Group className="mb-4">
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
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      type="submit" 
                      variant="success" 
                      size="lg"
                      className="fw-bold py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <FaSignInAlt className="me-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="mb-0">
                      New driver?{' '}
                      <Button 
                        variant="link" 
                        className="p-0 text-decoration-none d-inline-flex align-items-center" 
                        onClick={() => navigate('/drivers/signup')}
                        disabled={loading}
                      >
                        <FaUserPlus className="me-1" />
                        Sign up here
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
            box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.15);
          }
          .btn-link:hover {
            color: #198754 !important;
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

export default DriverLogin;
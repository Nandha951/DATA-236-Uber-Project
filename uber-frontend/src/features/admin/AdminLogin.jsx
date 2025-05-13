import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAdmin } from './adminSlice';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../../api/adminAPI';
import { Form, Button, Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaUserShield, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin({ email, password });
      dispatch(setAdmin(response.data));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="primary" />
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
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUserShield size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Admin Portal</h2>
                  <p className="text-muted">Sign in to your admin account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                    <div className="d-flex align-items-center">
                      <FaUserShield className="me-2" />
                      {error}
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleLogin} className="needs-validation">
                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control-lg"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
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
                      New admin?{' '}
                      <Button 
                        variant="link" 
                        className="p-0 text-decoration-none d-inline-flex align-items-center" 
                        onClick={() => navigate('/admin/signup')}
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
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }
          .btn-link:hover {
            color: #0d6efd !important;
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

export default AdminLogin;

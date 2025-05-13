import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loginCustomer } from '../features/customer/customerThunks';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CustomerLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginCustomer(form))
      .unwrap()
      .then((res) => {
        const id = res.customer?.customerId;
        if (id) {
          navigate(`/customers/${id}/profile`);
        }
      })
      .catch((err) => alert(err.message || 'Login failed'));
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUser size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Customer Login</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted">
                      <FaUser className="me-2" />
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
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      className="fw-bold py-2"
                    >
                      Sign In
                    </Button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/customers/signup" className="text-primary text-decoration-none">
                        Sign up
                      </Link>
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
          .spinner-border-sm {
            animation: spinner-border 0.75s linear infinite;
          }
          @keyframes spinner-border {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CustomerLogin;

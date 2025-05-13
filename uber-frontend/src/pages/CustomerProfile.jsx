import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchCustomerById } from '../features/customer/customerThunks';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard,
  FaHistory, FaCar, FaStar
} from 'react-icons/fa';

const CustomerProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authCustomer, profile } = useSelector((state) => state.customer);
  const customer = profile || authCustomer;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (customer?.customerId) {
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const response = await axios.get(`/api/rides/reviews/user/${customer.customerId}`, { headers });
          setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setReviews([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReviews();
  }, [customer]);

  if (!customer) return <p>Not logged in.</p>;

  const {
    customerId, firstName, lastName, email,
    phoneNumber, phone, address, city, state, zipCode
  } = customer;

  const avgRating = Array.isArray(reviews) && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 'N/A';

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) stars.push(<span key={i} className="text-warning">★</span>);
      else if (i === fullStars + 1 && hasHalfStar) stars.push(<span key={i} className="text-warning">⯨</span>);
      else stars.push(<span key={i} className="text-secondary">☆</span>);
    }

    return stars;
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUser size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">{firstName} {lastName}</h2>
                  <p className="text-muted mb-0">Customer ID: {customerId}</p>
                </div>

                <Row className="g-4">
                  <Col md={6}>
                    <Card className="h-100 border-0 bg-light">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          <FaEnvelope className="text-primary me-2" />
                          Contact Info
                        </h5>
                        <p className="mb-1">
                          <FaEnvelope className="text-muted me-2" />
                          {email}
                        </p>
                        <p className="mb-0">
                          <FaPhone className="text-muted me-2" />
                          {phoneNumber || phone}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="h-100 border-0 bg-light">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          <FaMapMarkerAlt className="text-primary me-2" />
                          Address
                        </h5>
                        <p className="mb-0">
                          {address}<br />
                          {city}, {state} {zipCode}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          <FaStar className="text-primary me-2" />
                          Rating & Reviews
                        </h5>
                        {avgRating !== 'N/A' ? (
                          <>
                            <p className="mb-1">
                              <strong>{avgRating}</strong> {renderStars(parseFloat(avgRating))}
                            </p>
                            <small className="text-muted">{reviews.length} reviews</small>
                          </>
                        ) : <p>No ratings yet</p>}

                        <hr />
                        {loading ? (
                          <p>Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                          <p>No reviews yet.</p>
                        ) : (
                          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {reviews.map((review, index) => (
                              <Card key={index} className="mb-2 p-2 bg-white shadow-sm">
                                <div className="d-flex justify-content-between">
                                  <div>{renderStars(review.rating)}</div>
                                  <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                                </div>
                                {review.comment && <p className="mt-2 mb-0">{review.comment}</p>}
                              </Card>
                            ))}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                  <Button variant="primary" size="lg" onClick={() => navigate(`/customers/${customerId}/book`)}>
                    <FaCar className="me-2" />
                    Book a Ride
                  </Button>

                  <Button variant="outline-primary" size="lg" onClick={() => navigate(`/customers/${customerId}/rides`)}>
                    <FaHistory className="me-2" />
                    My Rides
                  </Button>

                  <Button variant="outline-primary" size="lg" onClick={() => navigate(`/customers/${customerId}/billing`)}>
                    <FaCreditCard className="me-2" />
                    Billing History
                  </Button>

                  {/* ✅ Merged Edit Profile Button */}
                  <Button variant="warning" size="lg" className="ms-2" onClick={() => navigate(`/customers/${customerId}/edit-profile`)}>
                    ✏️ Edit Profile
                  </Button>
                </div>
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
        `}
      </style>
    </div>
  );
};

export default CustomerProfile;

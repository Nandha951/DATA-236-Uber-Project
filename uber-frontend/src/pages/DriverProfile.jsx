import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCar, FaShieldAlt, FaEdit, FaStar } from 'react-icons/fa';

const DriverProfile = () => {
  const { authDriver } = useSelector((state) => state.driver);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (authDriver?.driverId) {
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};

          const response = await axios.get(`/api/rides/reviews/user/${authDriver.driverId}`, { headers });
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
  }, [authDriver]);

  if (!authDriver) return <p>Not logged in.</p>;

  const { driverId, firstName, lastName, email, phoneNumber, licenseNumber, carDetails, insuranceDetails } = authDriver;

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
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUser size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">{firstName} {lastName}</h2>
                  <p className="text-muted mb-0">Driver ID: {driverId}</p>
                </div>

                <Row className="g-4">
                  <Col md={6}>
                    <Card className="h-100 border-0 bg-light">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          <FaEnvelope className="text-success me-2" />
                          Contact Information
                        </h5>
                        <p className="mb-2">
                          <FaEnvelope className="text-muted me-2" />
                          {email}
                        </p>
                        <p className="mb-0">
                          <FaPhone className="text-muted me-2" />
                          {phoneNumber}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="h-100 border-0 bg-light">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          <FaIdCard className="text-success me-2" />
                          License Information
                        </h5>
                        <p className="mb-0">
                          <FaIdCard className="text-muted me-2" />
                          License #: {licenseNumber}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="h-100 border-0 bg-light">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          <FaCar className="text-success me-2" />
                          Vehicle Details
                        </h5>
                        <p className="mb-2"><strong>Make:</strong> {carDetails.make}</p>
                        <p className="mb-2"><strong>Model:</strong> {carDetails.model}</p>
                        <p className="mb-0"><strong>Plate:</strong> {carDetails.licensePlate}</p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="h-100 border-0 bg-light">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          <FaShieldAlt className="text-success me-2" />
                          Insurance Details
                        </h5>
                        <p className="mb-2"><strong>Provider:</strong> {insuranceDetails.provider}</p>
                        <p className="mb-0"><strong>Policy #:</strong> {insuranceDetails.policyNumber}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Rating & Reviews */}
                <Card className="mt-4 border-0 bg-light">
                  <Card.Body>
                    <h5 className="fw-bold mb-3">
                      <FaStar className="text-warning me-2" />
                      Rating & Reviews
                    </h5>
                    <div className="mb-3">
                      <h4>
                        {avgRating !== 'N/A' ? (
                          <>
                            {avgRating} <span className="ms-2">{renderStars(parseFloat(avgRating))}</span>
                          </>
                        ) : 'No ratings yet'}
                      </h4>
                      <small className="text-muted">{reviews.length} reviews</small>
                    </div>

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

                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                  <Button 
                    variant="success" 
                    size="lg"
                    className="px-4"
                    onClick={() => navigate(`/drivers/${driverId}/summary`)}
                  >
                    <FaCar className="me-2" />
                    View Summary
                  </Button>
                  <Button 
                    variant="outline-success" 
                    size="lg"
                    className="px-4"
                    onClick={() => navigate(`/drivers/${driverId}/edit-profile`)}
                  >
                    <FaEdit className="me-2" />
                    Edit Profile
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

export default DriverProfile;

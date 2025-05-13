import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaUser, FaUserShield, FaShieldAlt, FaClock, FaMoneyBillWave, FaStar, FaQuoteLeft, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Tech Professional",
      text: "The seamless booking experience and professional drivers make my daily commute a breeze. The app's real-time tracking is a game-changer!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Maria Rodriguez",
      role: "Frequent Traveler",
      text: "As someone who travels frequently, I appreciate the reliability and comfort. The drivers are always punctual and the cars are immaculate.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "David Kim",
      role: "Driver Partner",
      text: "The flexible schedule and competitive earnings make this the perfect platform for drivers. The support team is always there when you need them.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  ];

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <div
        className="text-white py-5 mb-5 position-relative hero-section"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://media.istockphoto.com/id/519870714/photo/taxi.jpg?s=1024x1024&w=is&k=20&c=JhpvCgd1Dw8zlAcAInbCw7N42u3N2myhVNjk26UX2-w=")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={8} className="mx-auto text-center fade-in">
              <h1 className="display-2 fw-bold mb-4 text-gradient">Journey Beyond Limits</h1>
              <p className="lead mb-5 fs-3 text-light-emphasis">Where every ride is an experience. Book your journey with confidence, comfort, and class.</p>
              <div className="d-flex gap-4 justify-content-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 py-3 fw-bold hero-btn rounded-pill"
                  onClick={() => navigate('/customers/signup')}
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  className="px-5 py-3 fw-bold hero-btn rounded-pill"
                  onClick={() => navigate('/drivers/signup')}
                >
                  Join Our Fleet
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5 fw-bold section-title display-5">The DriveWay Difference</h2>
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-lg text-center p-4 feature-card">
              <div className="feature-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                <FaShieldAlt size={40} className="text-primary" />
              </div>
              <Card.Title className="h3 mb-3 fw-bold">Guardian Shield</Card.Title>
              <Card.Text className="text-muted fs-5">
                Your safety is our sacred promise. Every journey is protected by our comprehensive security system.
              </Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-lg text-center p-4 feature-card">
              <div className="feature-icon bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                <FaClock size={40} className="text-success" />
              </div>
              <Card.Title className="h3 mb-3 fw-bold">Time's Your Ally</Card.Title>
              <Card.Text className="text-muted fs-5">
                Your schedule, your rules. We're here whenever you need us, making every minute count.
              </Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-lg text-center p-4 feature-card">
              <div className="feature-icon bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                <FaMoneyBillWave size={40} className="text-warning" />
              </div>
              <Card.Title className="h3 mb-3 fw-bold">Value First</Card.Title>
              <Card.Text className="text-muted fs-5">
                Premium service without premium prices. Experience luxury that fits your budget.
              </Card.Text>
            </Card>
          </Col>
        </Row>

        {/* User Type Cards */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 shadow-lg user-card border-0">
              <Card.Body className="text-center p-5">
                <div className="mb-4">
                  <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                    <FaCar size={48} className="text-primary" />
                  </div>
                  <Card.Title className="h3 mb-3 fw-bold">Drive With Us</Card.Title>
                  <p className="text-muted mb-4 fs-5">Turn your vehicle into opportunity. Join our elite network of professional drivers.</p>
                </div>
                <div className="d-grid gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="mb-2 action-btn rounded-pill"
                    onClick={() => navigate('/drivers/signup')}
                  >
                    Start Driving
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="action-btn rounded-pill"
                    onClick={() => navigate('/drivers/login')}
                  >
                    Driver Login
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-lg user-card border-0">
              <Card.Body className="text-center p-5">
                <div className="mb-4">
                  <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                    <FaUser size={48} className="text-success" />
                  </div>
                  <Card.Title className="h3 mb-3 fw-bold">Travel With Us</Card.Title>
                  <p className="text-muted mb-4 fs-5">Your journey begins here. Experience transportation reimagined for the modern traveler.</p>
                </div>
                <div className="d-grid gap-3">
                  <Button
                    variant="success"
                    size="lg"
                    className="mb-2 action-btn rounded-pill"
                    onClick={() => navigate('/customers/signup')}
                  >
                    Begin Journey
                  </Button>
                  <Button
                    variant="outline-success"
                    size="lg"
                    className="action-btn rounded-pill"
                    onClick={() => navigate('/customers/login')}
                  >
                    Rider Login
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-lg user-card admin-card border-0">
              <Card.Body className="text-center p-5">
                <div className="mb-4">
                  <div className="icon-wrapper bg-light bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                    <FaUserShield size={48} className="text-light" />
                  </div>
                  <Card.Title className="h3 mb-3 fw-bold">Command Center</Card.Title>
                  <p className="text-light-50 mb-4 fs-5">Take control of the journey. Our comprehensive admin tools put you in the driver's seat.</p>
                </div>
                <div className="d-grid">
                  <Button
                    variant="light"
                    size="lg"
                    className="fw-bold action-btn rounded-pill"
                    onClick={() => navigate('/admin/login')}
                  >
                    Access Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contact Section */}
        <div className="py-5">
          <h2 className="text-center mb-5 fw-bold section-title display-5">Connect With Us</h2>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-lg text-center p-4 contact-card">
                <div className="contact-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                  <FaPhone size={32} className="text-primary" />
                </div>
                <Card.Title className="h4 mb-3">Call Us</Card.Title>
                <Card.Text className="text-muted fs-5">
                  +1 (555) 123-4567<br />
                  Available 24/7
                </Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-lg text-center p-4 contact-card">
                <div className="contact-icon bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                  <FaEnvelope size={32} className="text-success" />
                </div>
                <Card.Title className="h4 mb-3">Email Us</Card.Title>
                <Card.Text className="text-muted fs-5">
                  support@driveway.com<br />
                  partners@driveway.com
                </Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-lg text-center p-4 contact-card">
                <div className="contact-icon bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                  <FaMapMarkerAlt size={32} className="text-warning" />
                </div>
                <Card.Title className="h4 mb-3">Visit Us</Card.Title>
                <Card.Text className="text-muted fs-5">
                  123 Innovation Drive<br />
                  San Jose, CA 95113
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Testimonials Section */}
        <div className="py-5">
          <h2 className="text-center mb-5 fw-bold section-title display-5">Journey Stories</h2>
          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index}>
                <Card className="h-100 border-0 shadow-lg p-4 testimonial-card">
                  <div className="position-relative">
                    <FaQuoteLeft className="text-primary opacity-25 position-absolute" size={40} style={{ top: -20, left: -10 }} />
                    <div className="d-flex justify-content-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-warning mx-1" size={20} />
                      ))}
                    </div>
                    <Card.Text className="text-muted mb-4 text-center fs-5">
                      "{testimonial.text}"
                    </Card.Text>
                    <div className="text-center">
                      <h5 className="mb-1 fw-bold">{testimonial.name}</h5>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* Footer */}
      <Footer />

      <style>
        {`
          :root {
            --primary-color: #0d6efd;
            --secondary-color: #6c757d;
            --background-color: #f8f9fa;
            --border-radius: 1rem;
            --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

          .text-gradient {
            background: linear-gradient(45deg, #fff, #e0e0e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }

          .hero-section {
            position: relative;
            overflow: hidden;
          }
          
          .hero-section::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 150px;
            background: linear-gradient(to top, var(--background-color), transparent);
          }

          .hero-btn {
            transition: all 0.3s ease;
            border-radius: var(--border-radius);
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .hero-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }

          .section-title {
            position: relative;
            padding-bottom: 1.5rem;
          }

          .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 2px;
          }

          .feature-card {
            transition: all 0.4s ease;
            border-radius: var(--border-radius);
            overflow: hidden;
          }

          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--box-shadow) !important;
          }

          .feature-icon {
            width: 100px;
            height: 100px;
            transition: all 0.4s ease;
          }

          .feature-card:hover .feature-icon {
            transform: scale(1.1) rotate(5deg);
          }

          .user-card {
            transition: all 0.4s ease;
            border-radius: var(--border-radius);
            overflow: hidden;
          }

          .user-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--box-shadow) !important;
          }

          .admin-card {
            background: linear-gradient(135deg, var(--primary-color), #0a58ca);
            color: white;
          }

          .icon-wrapper {
            width: 120px;
            height: 120px;
            margin: 0 auto;
            transition: all 0.4s ease;
          }

          .user-card:hover .icon-wrapper {
            transform: scale(1.1);
          }

          .action-btn {
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }

          .action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .testimonial-card {
            transition: all 0.4s ease;
            border-radius: var(--border-radius);
            overflow: hidden;
          }

          .testimonial-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--box-shadow) !important;
          }

          .contact-card {
            transition: all 0.4s ease;
            border-radius: var(--border-radius);
            overflow: hidden;
          }

          .contact-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--box-shadow) !important;
          }

          .contact-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto;
            transition: all 0.4s ease;
          }

          .contact-card:hover .contact-icon {
            transform: scale(1.1);
          }

          @media (max-width: 768px) {
            .hero-section {
              min-height: 70vh;
            }
            
            .hero-btn {
              width: 100%;
            }

            .display-2 {
              font-size: 2.5rem;
            }

            .display-5 {
              font-size: 2rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserPlus, FaUsers, FaCar, FaMoneyBillWave, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const dashboardItems = [
    {
      title: 'Add Driver',
      description: 'Register a new driver',
      icon: <FaUserPlus size={32} />,
      link: '/admin/add-driver',
      variant: 'primary'
    },
    {
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: <FaUsers size={32} />,
      link: '/admin/add-customer',
      variant: 'success'
    },
    {
      title: 'View Drivers',
      description: 'Manage driver accounts',
      icon: <FaCar size={32} />,
      link: '/admin/review-driver',
      variant: 'info'
    },
    {
      title: 'View Customers',
      description: 'Manage customer accounts',
      icon: <FaUsers size={32} />,
      link: '/admin/review-customer',
      variant: 'warning'
    },
    {
      title: 'View Revenue',
      description: 'Analytics and reports',
      icon: <FaMoneyBillWave size={32} />,
      link: '/admin/revenue',
      variant: 'danger'
    }
  ];

  return (
    <div className="admin-dashboard-bg min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5 pt-4">
          <div className="dashboard-icon-wrapper mb-3">
            <FaCog size={40} className="text-primary" />
          </div>
          <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
          <p className="lead text-muted">Manage your ride-sharing platform efficiently</p>
        </div>

        <Row className="g-4 justify-content-center">
          {dashboardItems.map((item, index) => (
            <Col key={index} md={6} lg={4} className="d-flex">
              <Card className={`dashboard-card h-100 shadow border-0 flex-fill card-variant-${item.variant}`}>
                <Card.Body className="d-flex flex-column p-4 text-center">
                  <div className={`icon-background bg-${item.variant}-soft mb-4`}>
                    {item.icon}
                  </div>
                  <Card.Title className="h5 fw-bold mb-2">{item.title}</Card.Title>
                  <Card.Text className="text-muted mb-4 flex-grow-1">
                    {item.description}
                  </Card.Text>
                  <Link to={item.link} className="text-decoration-none mt-auto">
                    <Button
                      variant={`outline-${item.variant}`}
                      className="w-100 dashboard-button"
                    >
                      Go to {item.title}
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <style>
        {`
          .admin-dashboard-bg {
            background-color: #f8f9fa;
          }

          .dashboard-icon-wrapper {
            display: inline-block;
            padding: 15px;
            background-color: #e7f1ff;
            border-radius: 50%;
          }

          .dashboard-card {
            border-radius: 15px;
            transition: all 0.3s ease-in-out;
            overflow: hidden;
            position: relative;
            background-color: #fff;
          }

          .dashboard-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: var(--card-variant-color, #6c757d);
            transition: height 0.3s ease;
          }

          .dashboard-card:hover::before {
            height: 10px;
          }

          .card-variant-primary { --card-variant-color: #0d6efd; }
          .card-variant-success { --card-variant-color: #198754; }
          .card-variant-info { --card-variant-color: #0dcaf0; }
          .card-variant-warning { --card-variant-color: #ffc107; }
          .card-variant-danger { --card-variant-color: #dc3545; }
          .card-variant-secondary { --card-variant-color: #6c757d; }

          .dashboard-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.1) !important;
          }

          .icon-background {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            color: var(--card-variant-color);
            transition: all 0.3s ease;
          }

          .bg-primary-soft { background-color: rgba(13, 110, 253, 0.1); }
          .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); }
          .bg-info-soft { background-color: rgba(13, 202, 240, 0.1); }
          .bg-warning-soft { background-color: rgba(255, 193, 7, 0.1); }
          .bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); }
          .bg-secondary-soft { background-color: rgba(108, 117, 125, 0.1); }

          .dashboard-card:hover .icon-background {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
          }

          .dashboard-button {
            border-radius: 50px;
            padding: 10px 20px;
            font-weight: 600;
            transition: all 0.2s ease-in-out;
          }

          .dashboard-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .text-primary { color: #0d6efd !important; }
          .text-success { color: #198754 !important; }
          .text-info { color: #0dcaf0 !important; }
          .text-warning { color: #ffc107 !important; }
          .text-danger { color: #dc3545 !important; }
          .text-secondary { color: #6c757d !important; }
          .text-dark { color: #212529 !important; }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;

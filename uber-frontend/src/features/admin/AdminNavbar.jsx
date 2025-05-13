import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from './adminSlice';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaTachometerAlt, FaUserPlus, FaUsers, FaCar, FaChartBar, FaFileInvoiceDollar, FaSignOutAlt } from 'react-icons/fa';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/admin/login');
  };

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt className="me-2" /> },
    { to: '/admin/add-driver', label: 'Add Driver', icon: <FaCar className="me-2" /> },
    { to: '/admin/add-customer', label: 'Add Customer', icon: <FaUserPlus className="me-2" /> },
    { to: '/admin/review-driver', label: 'Review Driver', icon: <FaUsers className="me-2" /> },
    { to: '/admin/revenue', label: 'Ride Stats', icon: <FaChartBar className="me-2" /> },
    { to: '/admin/bill-search', label: 'Bill Search', icon: <FaFileInvoiceDollar className="me-2" /> },
  ];

  return (
    <Navbar bg="primary" variant="dark" expand="md" className="shadow-sm mb-4 py-2">
      <Container fluid>
        <Navbar.Brand className="fw-bold d-flex align-items-center">
          <FaTachometerAlt className="me-2" /> Admin Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`
                }
                style={{ marginRight: '1rem' }}
              >
                {icon} {label}
              </NavLink>
            ))}
          </Nav>
          <Button
            variant="outline-light"
            className="d-flex align-items-center ms-md-3"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Navbar.Collapse>
      </Container>
      <style>{`
        .navbar {
          transition: box-shadow 0.2s;
        }
        .navbar-brand {
          font-size: 1.3rem;
          letter-spacing: 1px;
        }
        .nav-link {
          transition: color 0.2s, background 0.2s;
          border-radius: 0.25rem;
          padding: 0.5rem 1rem;
        }
        .nav-link.active, .nav-link:hover {
          background: rgba(255,255,255,0.15);
          color: #fff !important;
        }
        .btn-outline-light {
          transition: all 0.2s;
        }
        .btn-outline-light:hover {
          background: #fff;
          color: #0d6efd !important;
        }
      `}</style>
    </Navbar>
  );
};

export default AdminNavbar;

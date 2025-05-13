import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutDriver } from '../features/driver/driverSlice';
import { logoutCustomer } from '../features/customer/customerSlice';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaCar, FaUser, FaSignInAlt, FaUserPlus, FaMoneyBillWave, FaSignOutAlt, FaHome, FaTaxi, FaUserCircle, FaClipboardList } from 'react-icons/fa';

const AppNavbar = () => {
  const { authDriver } = useSelector((state) => state.driver);
  const { authCustomer } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutDriver = () => {
    dispatch(logoutDriver());
    navigate('/drivers/login');
  };

  const handleLogoutCustomer = () => {
    dispatch(logoutCustomer());
    navigate('/customers/login');
  };

  const isHome = location.pathname === '/';

  return (
    <Navbar bg="white" variant="light" expand="lg" className="navbar-custom shadow-sm mb-4 py-3">
      <Container>
        {isHome ? (
          <span className="fw-bold d-flex align-items-center navbar-brand" style={{ cursor: 'default', pointerEvents: 'none' }}>
            <FaTaxi className="me-3 text-primary" size={28} />
            <span style={{ fontSize: '1.6rem' }}>Uber Clone</span>
          </span>
        ) : (
          <Navbar.Brand href="/" className="fw-bold d-flex align-items-center">
            <FaTaxi className="me-3 text-primary" size={28} />
            <span style={{ fontSize: '1.6rem' }}>Uber Clone</span>
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="main-navbar-nav" className="border-0" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {!isHome && !authDriver && !authCustomer && (
              <>
                <NavLink to="/drivers/signup" className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaUserPlus className="me-2" size={18} /> Driver Signup
                </NavLink>
                <NavLink to="/drivers/login" className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaSignInAlt className="me-2" size={18} /> Driver Login
                </NavLink>
                <NavLink to="/customers/signup" className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaUserPlus className="me-2" size={18} /> Customer Signup
                </NavLink>
                <NavLink to="/customers/login" className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaSignInAlt className="me-2" size={18} /> Customer Login
                </NavLink>
              </>
            )}

            {authDriver && (
              <>
                <NavLink to={`/drivers/${authDriver.driverId}/summary`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaHome className="me-2" size={18} /> Summary
                </NavLink>
                <NavLink to={`/drivers/${authDriver.driverId}/rides`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaClipboardList className="me-2" size={18} /> My Rides
                </NavLink>
                <NavLink to={`/drivers/${authDriver.driverId}/profile`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaUserCircle className="me-2" size={18} /> Profile
                </NavLink>
                <NavLink to={`/drivers/${authDriver.driverId}/billing`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaMoneyBillWave className="me-2" size={18} /> Billing
                </NavLink>
                <Button variant="outline-primary" size="lg" onClick={handleLogoutDriver} className="d-flex align-items-center ms-2 px-4">
                  <FaSignOutAlt className="me-2" size={18} /> Logout
                </Button>
              </>
            )}

            {authCustomer && (
              <>
                <NavLink to={`/customers/${authCustomer.customerId}/profile`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaUserCircle className="me-2" size={18} /> Profile
                </NavLink>
                <NavLink to={`/customers/${authCustomer.customerId}/book`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaCar className="me-2" size={18} /> Book Ride
                </NavLink>
                <NavLink to={`/customers/${authCustomer.customerId}/rides`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaClipboardList className="me-2" size={18} /> My Rides
                </NavLink>
                <NavLink to={`/customers/${authCustomer.customerId}/billing`} className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active fw-bold' : ''}`}>
                  <FaMoneyBillWave className="me-2" size={18} /> Billing
                </NavLink>
                <Button variant="outline-primary" size="lg" onClick={handleLogoutCustomer} className="d-flex align-items-center ms-2 px-4">
                  <FaSignOutAlt className="me-2" size={18} /> Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style>{`
        .navbar-custom {
          background: white !important;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .navbar-brand {
          font-size: 1.6rem;
          letter-spacing: 1px;
          color: var(--primary-color) !important;
        }
        .nav-link {
          transition: all 0.3s ease;
          border-radius: var(--border-radius);
          padding: 0.75rem 1.25rem;
          margin-right: 0.5rem;
          font-weight: 500;
          color: var(--text-color) !important;
        }
        .nav-link:hover {
          background: var(--background-color);
          color: var(--secondary-color) !important;
          transform: translateY(-1px);
        }
        .nav-link.active {
          background: var(--secondary-color);
          color: white !important;
        }
        .btn-outline-primary {
          border-color: var(--secondary-color);
          color: var(--secondary-color);
          transition: all 0.3s ease;
        }
        .btn-outline-primary:hover {
          background: var(--secondary-color);
          color: white !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(9, 132, 227, 0.2);
        }
        @media (max-width: 991.98px) {
          .navbar-collapse {
            padding: 1rem 0;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            margin-top: 1rem;
          }
          .nav-link {
            padding: 0.75rem 1rem;
            margin: 0.25rem 0;
          }
          .btn-outline-primary {
            margin-top: 1rem;
            width: 100%;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default AppNavbar;

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const customerId = useSelector(state => state.user.customerId);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('customerId');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'fw-bold text-dark' : 'text-muted');

  return (
    <nav className={`navbar navbar-expand-lg ${isAuthPage ? 'navbar-dark bg-black' : 'navbar-light bg-white'} border-bottom shadow-sm px-4`}>
      <div className="container-fluid">
        <Link to="/" className={`navbar-brand fw-bold fs-4 text-uppercase ${isAuthPage ? 'text-white' : 'text-dark'}`}>
          Uber
        </Link>

        {/* Links for logged-in users */}
        {!isAuthPage && customerId && (
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex gap-4">
              <li className="nav-item">
                <Link to="/customer-ride" className={`nav-link ${isActive('/customer-ride')}`}>Book Ride</Link>
              </li>
              <li className="nav-item">
                <Link to="/ride-history" className={`nav-link ${isActive('/ride-history')}`}>Ride History</Link>
              </li>
            </ul>
            <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

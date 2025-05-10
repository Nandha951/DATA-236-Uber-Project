import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeFromStorage } from './features/user/userSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookRide from './pages/BookRide';
import RideHistory from './pages/RideHistory';
import UploadImage from './pages/UploadImage';
import UpdateCard from './pages/UpdateCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Account from './pages/Account';
import PersonalInfo from './pages/PersonalInfo';
import CustomerDashboard from './pages/CustomerDashboard';
import ChooseRide from './pages/ChooseRide';
import Payment from './pages/Payment';
import BillingPage from './pages/BillingPage';

const ProtectedRoute = ({ children }) => {
  const { token, customerId } = useSelector((state) => state.user);
  console.log('ProtectedRoute check:', { token, customerId });
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload-image" element={<ProtectedRoute><UploadImage /></ProtectedRoute>} />
        <Route path="/update-card" element={<ProtectedRoute><UpdateCard /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/account/personal-info" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
        <Route path="/customer-ride" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/choose-ride" element={<ProtectedRoute><ChooseRide /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/ride-history" element={<ProtectedRoute><RideHistory /></ProtectedRoute>} />
        <Route path="/book-ride" element={<ProtectedRoute><BookRide /></ProtectedRoute>} />
        <Route path="/ride/:id" element={<ProtectedRoute><BookRide /></ProtectedRoute>} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/billing/:rideId" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

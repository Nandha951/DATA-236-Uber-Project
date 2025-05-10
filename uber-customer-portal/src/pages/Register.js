import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authService';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    ssn: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const customer = await register(formData);
      dispatch(setUser(customer));
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-relative"
      style={{
        height: '100vh',
        backgroundImage: `url('/login-back.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          zIndex: 0,
        }}
      />
      <div
        className="position-relative d-flex justify-content-end align-items-center h-100"
        style={{ paddingRight: '5vw', zIndex: 1 }}
      >
        <div
          className="card bg-dark text-white p-4"
          style={{
            width: '100%',
            maxWidth: '500px',
            opacity: 0.95,
            backdropFilter: 'blur(4px)',
          }}
        >
          <h2 className="text-center mb-4">Uber Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white">SSN</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="ssn" value={formData.ssn} onChange={handleChange} placeholder="Enter SSN" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">First Name</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Last Name</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Email</label>
              <input type="email" className="form-control bg-dark text-white border-secondary" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Password</label>
              <input type="password" className="form-control bg-dark text-white border-secondary" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Confirm Password</label>
              <input type="password" className="form-control bg-dark text-white border-secondary" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Phone</label>
              <input type="tel" className="form-control bg-dark text-white border-secondary" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Address</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">City</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">State</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" required />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">ZIP</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="zip" value={formData.zip} onChange={handleChange} placeholder="Enter ZIP code" required />
            </div>
            <button className="btn btn-light w-100" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account?{' '}
            <a href="/login" className="text-info">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

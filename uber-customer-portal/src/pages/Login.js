import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { customer, token } = await login(email, password);
      dispatch(setUser(customer));
      dispatch(setToken(token));
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.error || 'Login failed. Please try again.');
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
            maxWidth: '400px',
            opacity: 0.95,
            backdropFilter: 'blur(4px)',
          }}
        >
          <h2 className="text-center mb-4">Uber Login</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-white">Email</label>
              <input
                type="email"
                className="form-control bg-dark text-white border-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button 
              className="btn btn-light w-100" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account?{' '}
            <a href="/register" className="text-info">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

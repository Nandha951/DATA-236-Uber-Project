import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UpdateCard = () => {
  const [card, setCard] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [message, setMessage] = useState('');
  const customerId = useSelector(state => state.user.customerId);

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!customerId) {
      alert('Please log in first');
      window.location.href = '/login';
      return;
    }

    try {
      await axios.put(`http://localhost:3012/api/customers/${customerId}/credit-card`, card);
      setMessage('✅ Credit card updated successfully!');
    } catch (err) {
      setMessage('❌ Failed to update card.');
    }
  };

  return (
    <div className="vh-100 bg-gradient d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }}>
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: 400, borderRadius: 20, background: 'rgba(30,30,30,0.97)', color: 'white' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Update Credit Card</h2>
          <p className="text-secondary mb-0">Securely update your payment details</p>
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Card Number</label>
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border-secondary"><i className="bi bi-credit-card"></i></span>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={card.cardNumber}
              onChange={handleChange}
              className="form-control bg-dark text-white border-secondary"
              maxLength={19}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Expiry (MM/YY)</label>
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border-secondary"><i className="bi bi-calendar"></i></span>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={card.expiry}
              onChange={handleChange}
              className="form-control bg-dark text-white border-secondary"
              maxLength={5}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label text-white">CVV</label>
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border-secondary"><i className="bi bi-shield-lock"></i></span>
            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              value={card.cvv}
              onChange={handleChange}
              className="form-control bg-dark text-white border-secondary"
              maxLength={4}
            />
          </div>
        </div>

        <button className="btn btn-warning w-100 fw-bold py-2 mb-2" onClick={handleUpdate} style={{ fontSize: 18, borderRadius: 10 }}>
          <i className="bi bi-credit-card-2-front me-2"></i>Update Card
        </button>

        {message && (
          <div className={`alert text-center mt-3 ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} style={{ borderRadius: 10 }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateCard;

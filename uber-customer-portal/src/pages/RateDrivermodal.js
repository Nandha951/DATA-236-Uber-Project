import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const RateDriverModal = ({ rideId, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:3014/api/rides/${rideId}/rate/driver`, {
        stars: rating,
        review
      });
      alert('✅ Driver rated successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit rating');
    }
  };

  return (
    <div className="modal p-4 bg-light rounded shadow border" style={{ maxWidth: 400, margin: '20px auto' }}>
      <h5 className="mb-3">Rate Your Driver</h5>

      <div className="mb-3 text-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={30}
            className="mx-1"
            style={{ cursor: 'pointer' }}
            color={(hover || rating) >= star ? '#ffc107' : '#e4e5e9'}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </div>

      <textarea
        placeholder="Leave a review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="form-control mb-3"
      />

      <button className="btn btn-dark me-2" onClick={handleSubmit}>Submit</button>
      <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default RateDriverModal;

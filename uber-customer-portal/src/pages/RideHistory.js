import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// ⭐ Rate Driver Modal
const RateDriverModal = ({ rideId, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:3016/api/rides/${rideId}/rate/driver`, {
        stars: rating,
        review,
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

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);

  const customerId = useSelector((state) => state.user.customerId);

  useEffect(() => {
    if (!customerId) {
      alert('Please log in');
      window.location.href = '/login';
      return;
    }

    const fetchRides = async () => {
      try {
        const res = await axios.get(`http://localhost:3016/api/rides/customer/${customerId}`);
        console.log('Fetched rides:', res.data);
        setRides(res.data);
      } catch (err) {
        console.error('❌ Error fetching rides:', err);
        alert('Failed to load ride history');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [customerId, selectedRide]); // refetch when a ride is rated

  return (
    <div style={{ padding: '30px' }}>
      <h2>My Ride History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : rides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li
              key={ride._id}
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                backgroundColor: !ride.pickup || !ride.dropoff ? '#f8d7da' : 'white',
              }}
            >
              <strong>Ride ID:</strong> {ride._id}<br />
              <strong>Status:</strong> {ride.status}<br />
              <strong>Fare:</strong> ${ride.fare?.toFixed(2)}<br />
              <strong>Pickup:</strong> {ride.pickup?.address || <em className="text-danger">Missing</em>}<br />
              <strong>Dropoff:</strong> {ride.dropoff?.address || <em className="text-danger">Missing</em>}<br />
              <strong>Date:</strong> {new Date(ride.createdAt).toLocaleString()}<br />

              {/* ⭐ Show existing rating */}
              {ride.rating?.byCustomer && (
                <div className="mt-2">
                  <span className="fw-bold text-dark">Your Rating: </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={16}
                      color={ride.rating.byCustomer.stars >= star ? '#ffc107' : '#e4e5e9'}
                      className="me-1"
                    />
                  ))}
                  {ride.rating.byCustomer.review && (
                    <div className="text-muted mt-1">
                      <em>"{ride.rating.byCustomer.review}"</em>
                    </div>
                  )}
                </div>
              )}

              {/* ⭐ Rate button if not rated yet */}
              {ride.status === 'completed' && !ride.rating?.byCustomer && (
                <button
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() => setSelectedRide(ride)}
                >
                  Rate Driver
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal for rating */}
      {selectedRide && (
        <RateDriverModal
          rideId={selectedRide._id}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </div>
  );
};

export default RideHistory;

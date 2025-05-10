import React, { useEffect, useState } from 'react';
import { getRidesByCustomer } from '../api/rideService';

function RideHistory() {
  const [rides, setRides] = useState([]);
  const customerId = '66391f3d8f929d157fffd123'; // same as used in booking

  useEffect(() => {
    getRidesByCustomer(customerId)
      .then(res => setRides(res.data))
      .catch(err => console.error('Error fetching rides', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Ride History</h2>
      {rides.length === 0 ? (
        <p>No rides booked yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rides.map(ride => (
            <li key={ride._id} style={rideCardStyle}>
              <div><b>From:</b> {ride.pickup.address}</div>
              <div><b>To:</b> {ride.dropoff.address}</div>
              <div><b>Fare:</b> ${ride.fare}</div>
              <div><b>Status:</b> {ride.status}</div>
              <div><small>{new Date(ride.createdAt).toLocaleString()}</small></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const rideCardStyle = {
  padding: '1rem',
  marginBottom: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9'
};

export default RideHistory;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UploadImage = () => {
  const [rides, setRides] = useState([]);
  const [rideId, setRideId] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const customerId = useSelector(state => state.user.customerId);

  useEffect(() => {
    if (!customerId) {
      alert('Please log in first');
      window.location.href = '/login';
      return;
    }

    const fetchRides = async () => {
      try {
        const res = await axios.get(`http://localhost:3012/api/customers/${customerId}/rides`);
        setRides(res.data);
      } catch (err) {
        alert('Failed to fetch rides');
      }
    };

    fetchRides();
  }, [customerId]);

  const handleUpload = async () => {
    if (!file || !rideId) {
      setMessage('Please select a ride and image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post(
        `http://localhost:3012/api/customers/rides/${rideId}/upload-image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage('✅ Image uploaded successfully!');
    } catch (err) {
      setMessage('❌ Upload failed.');
    }
  };

  return (
    <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center">
      <div className="card bg-dark text-white p-4 w-100" style={{ maxWidth: 500 }}>
        <h2 className="text-center mb-4">Upload Ride Image</h2>

        <div className="mb-3">
          <label>Select Ride</label>
          <select
            className="form-select bg-dark text-white border-secondary"
            value={rideId}
            onChange={(e) => setRideId(e.target.value)}
          >
            <option value="">-- Select Ride --</option>
            {rides.map((ride) => (
              <option key={ride._id} value={ride._id}>
                {ride._id.slice(-6)} — {ride.pickup?.address || 'N/A'} to {ride.dropoff?.address || 'N/A'}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <input
            type="file"
            className="form-control bg-dark text-white border-secondary"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button className="btn btn-light w-100" onClick={handleUpload}>
          Upload Image
        </button>

        {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
      </div>
    </div>
  );
};

export default UploadImage;

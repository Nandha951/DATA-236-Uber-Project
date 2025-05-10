import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const BookRide = () => {
  const navigate = useNavigate();
  const customerId = useSelector(state => state.user.customerId);
  const [pickup, setPickup] = useState({ address: '', latitude: 0, longitude: 0 });
  const [dropoff, setDropoff] = useState({ address: '', latitude: 0, longitude: 0 });
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: pickup.latitude || 37.7749,
    lng: pickup.longitude || -122.4194
  };

  useEffect(() => {
    if (pickup.latitude && pickup.longitude) {
      fetchNearbyDrivers();
    }
  }, [pickup]);

  const fetchNearbyDrivers = async () => {
    try {
      const response = await axios.get(`/api/rides/nearby-drivers?latitude=${pickup.latitude}&longitude=${pickup.longitude}`);
      setNearbyDrivers(response.data);
    } catch (err) {
      setError('Failed to fetch nearby drivers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const rideData = {
        pickup,
        dropoff,
        customerId: customerId,
        fare: await calculateFare()
      };

      const response = await axios.post('/api/rides', rideData);
      navigate(`/ride/${response.data._id}`);
    } catch (err) {
      setError('Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  const calculateFare = async () => {
    try {
      const distance = getDistance(pickup, dropoff); // in km
      const response = await axios.post('http://localhost:5000/predict-fare', {
        pickupTime: new Date(),
        distanceCovered: distance,
        rating: 5 // Placeholder rating
      });
      return response.data.predicted_fare;
    } catch (err) {
      console.error('Error fetching fare:', err);
      return 0;
    }
  };

  const getDistance = (point1, point2) => {
    // Implement distance calculation using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 0.621371; // Convert to miles
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book a Ride</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Pickup Location</label>
          <input
            type="text"
            value={pickup.address}
            onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter pickup address"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Dropoff Location</label>
          <input
            type="text"
            value={dropoff.address}
            onChange={(e) => setDropoff({ ...dropoff, address: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter dropoff address"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Booking...' : 'Book Ride'}
        </button>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Nearby Drivers</h2>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
          >
            {nearbyDrivers.map((driver) => (
              <Marker
                key={driver._id}
                position={{
                  lat: driver.location.latitude,
                  lng: driver.location.longitude
                }}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Available Drivers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyDrivers.map((driver) => (
            <div key={driver._id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">{driver.name}</h3>
              <p className="text-gray-600">{driver.vehicle}</p>
              <p className="text-green-600">Available</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookRide; 
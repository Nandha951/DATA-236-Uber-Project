import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bookRide } from '../features/ride/rideThunks';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaSearch, FaSpinner } from 'react-icons/fa';
import RideMap from '../components/RideMap';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const CustomerBookRide = () => {
  const { authCustomer } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    dateTime: ''
  });

  // For autocomplete and map click
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [activeInput, setActiveInput] = useState('pickup'); // 'pickup' or 'dropoff'
  const [loading, setLoading] = useState(false);

  // Fetch suggestions from Mapbox
  const fetchSuggestions = async (query, setter) => {
    if (!query) return setter([]);
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await res.json();
    setter(data.features || []);
  };

  // Handle input change for pickup/dropoff
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'pickupLocation') {
      fetchSuggestions(value, setPickupSuggestions);
      setActiveInput('pickup');
    } else if (name === 'dropoffLocation') {
      fetchSuggestions(value, setDropoffSuggestions);
      setActiveInput('dropoff');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion, type) => {
    const [lng, lat] = suggestion.center;
    const location = suggestion.place_name;

    if (type === 'pickup') {
      setForm((prev) => ({ ...prev, pickupLocation: location }));
      setPickupCoords({ lat, lng });
      setPickupSuggestions([]);
    } else {
      setForm((prev) => ({ ...prev, dropoffLocation: location }));
      setDropoffCoords({ lat, lng });
      setDropoffSuggestions([]);
    }
  };

  // Handle map click
  const handleMapClick = (lngLat) => {
    if (activeInput === 'pickup') {
      setPickupCoords({ lat: lngLat.lat, lng: lngLat.lng });
      setForm((prev) => ({ ...prev, pickupLocation: `Lat: ${lngLat.lat}, Lng: ${lngLat.lng}` }));
    } else if (activeInput === 'dropoff') {
      setDropoffCoords({ lat: lngLat.lat, lng: lngLat.lng });
      setForm((prev) => ({ ...prev, dropoffLocation: `Lat: ${lngLat.lat}, Lng: ${lngLat.lng}` }));
    }
  };

  // Mapbox geocoding for manual entry (if user doesn't pick from suggestions)
  const geocodeAddress = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await res.json();
    if (data?.features?.length) {
      const [lng, lat] = data.features[0].center;
      return {
        address: data.features[0].place_name,
        coordinates: { lat, lng }
      };
    } else {
      throw new Error(`Mapbox geocoding failed for: ${address}`);
    }
  };

  // Haversine distance
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupCoords || !dropoffCoords) {
      alert('Please select both pickup and dropoff locations from the suggestions');
      return;
    }

    setLoading(true);
    try {
      const rideData = {
        pickupLocation: {
          address: form.pickupLocation,
          latitude: pickupCoords.lat,
          longitude: pickupCoords.lng
        },
        dropoffLocation: {
          address: form.dropoffLocation,
          latitude: dropoffCoords.lat,
          longitude: dropoffCoords.lng
        },
        dateTime: form.dateTime,
        customerId: authCustomer.customerId,
        passenger_count: 1
      };

      console.log('Sending ride data:', rideData);

      const response = await dispatch(bookRide(rideData)).unwrap();
      console.log('Booking response:', response); // Debug log

      if (response && response.ride) {
        // Navigate to customer's rides list after successful booking
        navigate(`/customers/${authCustomer.customerId}/rides`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaCar size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Book a Ride</h2>
                  <p className="text-muted">Enter your pickup and dropoff locations</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted">
                      <FaMapMarkerAlt className="me-2" />
                      Pickup Location
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="pickupLocation"
                        value={form.pickupLocation}
                        onChange={handleChange}
                        required
                        className="form-control-lg"
                        placeholder="Enter pickup location"
                      />
                      {pickupSuggestions.length > 0 && (
                        <div className="position-absolute w-100 bg-white shadow-sm rounded-bottom" style={{ zIndex: 1000 }}>
                          {pickupSuggestions.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="p-2 cursor-pointer hover-bg-light"
                              onClick={() => handleSuggestionClick(suggestion, 'pickup')}
                              style={{ cursor: 'pointer' }}
                            >
                              <FaMapMarkerAlt className="text-muted me-2" />
                              {suggestion.place_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted">
                      <FaMapMarkerAlt className="me-2" />
                      Dropoff Location
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="dropoffLocation"
                        value={form.dropoffLocation}
                        onChange={handleChange}
                        required
                        className="form-control-lg"
                        placeholder="Enter dropoff location"
                      />
                      {dropoffSuggestions.length > 0 && (
                        <div className="position-absolute w-100 bg-white shadow-sm rounded-bottom" style={{ zIndex: 1000 }}>
                          {dropoffSuggestions.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="p-2 cursor-pointer hover-bg-light"
                              onClick={() => handleSuggestionClick(suggestion, 'dropoff')}
                              style={{ cursor: 'pointer' }}
                            >
                              <FaMapMarkerAlt className="text-muted me-2" />
                              {suggestion.place_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted">
                      <FaCalendarAlt className="me-2" />
                      Pickup Time
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="dateTime"
                      value={form.dateTime}
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="spinner-border-sm" />
                          Booking Ride...
                        </>
                      ) : (
                        <>
                          <FaSearch />
                          Book Ride
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {(pickupCoords || dropoffCoords) && (
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <RideMap
                    pickup={pickupCoords ? [pickupCoords.lng, pickupCoords.lat] : null}
                    dropoff={dropoffCoords ? [dropoffCoords.lng, dropoffCoords.lat] : null}
                    onMapClick={handleMapClick}
                    style={{ height: '400px', width: '100%' }}
                  />
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <style>
        {`
          .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
          }
          .btn-link:hover {
            color: #0d6efd !important;
          }
          .suggestion-item {
            cursor: pointer;
            padding: 0.5rem 1rem;
            transition: background-color 0.2s ease;
          }
          .suggestion-item:hover {
            background-color: #f8f9fa;
          }
          .card {
            transition: transform 0.2s ease-in-out;
          }
          .card:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
    </div>
  );
};

export default CustomerBookRide;
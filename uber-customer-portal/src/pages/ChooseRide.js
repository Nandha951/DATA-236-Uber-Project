import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader
} from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 60px)',
  display: 'flex'
};


const leftStyle = {
  width: '400px',
  padding: '1.5rem',
  backgroundColor: '#f8f8f8',
  borderRight: '1px solid #ddd',
  fontFamily: 'Arial'
};

const rightStyle = {
  flex: 1
};

const topNavStyle = {
  height: '60px',
  backgroundColor: 'black',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '1rem',
  fontSize: '24px',
  fontWeight: 'bold'
};

const mapOptions = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

function ChooseRide() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [fare, setFare] = useState(0);

  const { pickup, dropoff } = state;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      err => alert('Location access denied.')
    );
  }, []);

  useEffect(() => {
    if (pickup && dropoff && isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error('Error fetching directions', status);
          }
        }
      );
    }
  }, [pickup, dropoff, isLoaded]);

  useEffect(() => {
    const fetchFare = async () => {
      try {
        const getDistance = (point1, point2) => {
          const R = 6371; // km
          const dLat = (point2.lat - point1.lat) * Math.PI / 180;
          const dLon = (point2.lng - point1.lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        };
        const distance = getDistance(pickup, dropoff);
        const fareRequest = {
          pickupTime: new Date(),
          distanceCovered: distance,
          rating: 5 // Placeholder rating
        };
        console.log('Fare request details:', fareRequest);
        const response = await axios.post('http://localhost:5000/predict-fare', fareRequest);
        setFare(response.data.predicted_fare);
      } catch (err) {
        console.error('Error fetching fare:', err);
      }
    };
    fetchFare();
  }, [pickup, dropoff]);

  const carIcon = isLoaded
    ? {
        url: 'https://cdn-icons-png.flaticon.com/512/61/61283.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    : null;

  const handleRequestRide = () => {
    navigate('/payment', {
      state: {
        pickup,
        dropoff,
        rideType: 'UberX',
        price: fare,
        discount: 25
      }
    });
  };

  if (!isLoaded || !location) return <div>Loading map...</div>;

  return (
    <>
      <div style={topNavStyle}>Uber</div>

      <div style={containerStyle}>
        {/* Left Sidebar */}
        <div style={leftStyle}>
          <div>
            <p><b>{pickup.address}</b> → <b>{dropoff.address}</b></p>
            <p>Leave Now</p>
          </div>

          <hr />

          {/* Ride Option */}
          <div
            style={{
              border: '2px solid black',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src="https://img.icons8.com/ios/452/car--v1.png"
                alt="UberX"
                style={{ width: 60 }}
              />
              <div>
                <h4>UberX</h4>
                <p>Affordable rides all to yourself</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold' }}>${fare.toFixed(2)}</p>
                <span style={{ color: 'green' }}>25% off</span>
              </div>
            </div>
          </div>

          <p style={{ marginTop: '1rem' }}>Google Pay</p>

          <button
            onClick={handleRequestRide}
            style={{
              width: '100%',
              backgroundColor: 'black',
              color: 'white',
              padding: '12px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Request UberX
          </button>
        </div>

        {/* Map */}
        <GoogleMap
          mapContainerStyle={rightStyle}
          center={pickup}
          zoom={13}
          options={mapOptions}
        >
          <Marker position={pickup} label="A" />
          <Marker position={dropoff} label="B" />
          {carIcon &&
            [...Array(6)].map((_, i) => (
              <Marker
                key={i}
                position={{
                  lat: location.lat + (Math.random() - 0.5) * 0.02,
                  lng: location.lng + (Math.random() - 0.5) * 0.02
                }}
                icon={carIcon}
              />
            ))}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </>
  );
}

export default ChooseRide;

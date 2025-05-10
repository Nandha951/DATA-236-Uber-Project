

import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';
import { useNavigate, Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 60px)',
  display: 'flex'
};

const sidebarStyle = {
  width: '350px',
  padding: '1.5rem',
  backgroundColor: '#f8f8f8',
  borderRight: '1px solid #ddd',
  fontFamily: 'Arial'
};

const mapStyle = {
  flex: 1
};

const topNavStyle = {
  height: '60px',
  backgroundColor: 'black',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1rem',
  fontSize: '20px'
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

function CustomerDashboard() {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupAuto, setPickupAuto] = useState(null);
  const [dropoffAuto, setDropoffAuto] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      err => alert('Location access denied.')
    );
  }, []);

  const handleSearch = () => {
    if (!pickupAuto || !dropoffAuto) return alert('Select both locations');

    const pickupPlace = pickupAuto.getPlace();
    const dropoffPlace = dropoffAuto.getPlace();

    const pickup = {
      lat: pickupPlace.geometry.location.lat(),
      lng: pickupPlace.geometry.location.lng(),
      address: pickupPlace.formatted_address
    };

    const dropoff = {
      lat: dropoffPlace.geometry.location.lat(),
      lng: dropoffPlace.geometry.location.lng(),
      address: dropoffPlace.formatted_address
    };

    console.log('Navigating to choose-ride with:', pickup, dropoff);
    navigate('/choose-ride', { state: { pickup, dropoff } });
  };

  const carIcon = isLoaded
    ? {
        url: 'https://cdn-icons-png.flaticon.com/512/61/61283.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    : null;

  const customerIcon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  };

  if (!isLoaded || !currentLocation) {
    return <div style={{ padding: '2rem' }}>Loading map and getting directions...</div>;
  }

  return (
    <>
      <div style={topNavStyle}>
        <span>Uber</span>
        <Link to="/ride-history" style={{ color: 'white', textDecoration: 'underline' }}>
          Ride History
        </Link>
      </div>

      <div style={containerStyle}>
        <div style={sidebarStyle}>
        <h3 style={{ color: 'black' }}>Get a ride 🚗</h3>


          <div>
            <b>📍 Pickup location</b><br />
            <Autocomplete onLoad={setPickupAuto}>
              <input placeholder="Enter pickup" style={inputStyle} />
            </Autocomplete>
          </div>

          <div>
            <b>🏁 Dropoff location</b><br />
            <Autocomplete onLoad={setDropoffAuto}>
              <input placeholder="Enter dropoff" style={inputStyle} />
            </Autocomplete>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <b>🕒 Pickup:</b> Now
          </div>

          <button style={buttonStyle} onClick={handleSearch}>search</button>
        </div>

        <GoogleMap
          mapContainerStyle={mapStyle}
          center={currentLocation}
          zoom={14}
          options={mapOptions}
        >
          <Marker position={currentLocation} icon={customerIcon} />
          {carIcon &&
            [...Array(6)].map((_, i) => (
              <Marker
                key={i}
                position={{
                  lat: currentLocation.lat + (Math.random() - 0.5) * 0.02,
                  lng: currentLocation.lng + (Math.random() - 0.5) * 0.02
                }}
                icon={carIcon}
              />
            ))}
        </GoogleMap>
      </div>
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  fontSize: '14px'
};

const buttonStyle = {
  marginTop: '1.5rem',
  backgroundColor: 'black',
  color: 'white',
  padding: '10px 20px',
  fontSize: '16px',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '4px'
};

export default CustomerDashboard;

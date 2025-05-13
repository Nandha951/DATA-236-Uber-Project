import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const RideMap = ({ pickup, dropoff, onMapClick }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Center on pickup or default to SF
    const center = pickup || [-122.4194, 37.7749];

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom: 10,
      });

      // Map click handler
      mapRef.current.on('click', (e) => {
        if (onMapClick) onMapClick(e.lngLat);
      });
    } else {
      mapRef.current.setCenter(center);
    }

    // Remove old markers
    mapRef.current.markers = mapRef.current.markers || [];
    mapRef.current.markers.forEach((marker) => marker.remove());
    mapRef.current.markers = [];

    // Add pickup marker
    if (pickup) {
      const marker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat(pickup)
        .addTo(mapRef.current);
      mapRef.current.markers.push(marker);
    }

    // Add dropoff marker
    if (dropoff) {
      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(dropoff)
        .addTo(mapRef.current);
      mapRef.current.markers.push(marker);
    }

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickup, dropoff, onMapClick]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '10px',
        marginBottom: '20px',
      }}
    />
  );
};

export default RideMap;
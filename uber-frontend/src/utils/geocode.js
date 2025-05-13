export const geocodeAddress = async (address) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.status === 'OK') {
      const result = data.results[0].geometry.location;
      return {
        address,
        coordinates: {
          lat: result.lat,
          lng: result.lng
        }
      };
    } else {
      throw new Error(`Geocoding failed for address: ${address}`);
    }
  };
  
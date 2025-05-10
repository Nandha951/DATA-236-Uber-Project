import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createRide } from '../api/rideService';
import { createBilling } from '../features/billing/billingActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customerId = useSelector(state => state.user.customerId);
  const { pickup, dropoff, rideType, price } = state || {};

  // Use the same distance algorithm as in ChooseRide.js (returns km)
  function getDistance(point1, point2) {
    if (!point1 || !point2) return 0;
    const R = 6371; // km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const handlePayment = async () => {
    const rideData = {
      customerId: customerId,
      driverId: '66391f3d8f929d157fffd456',
      pickup: {
        latitude: pickup.lat,
        longitude: pickup.lng,
        address: pickup.address
      },
      dropoff: {
        latitude: dropoff.lat,
        longitude: dropoff.lng,
        address: dropoff.address
      },
      fare: price,
      status: 'requested'
    };

    try {
      const ride = await createRide(rideData); // Assume this returns the ride object with _id
      // Create the bill
      const now = new Date();
      const billingId = ride && ride._id ? ride._id : `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const distanceCovered = getDistance(pickup, dropoff); // in km
      const billPayload = {
        billingId,
        date: now,
        pickupTime: now,
        dropoffTime: now,
        distanceCovered,
        rating: 5,
        sourceLocation: pickup.address,
        destinationLocation: dropoff.address,
        driverId: ride.driverId || rideData.driverId,
        customerId: customerId,
        // totalAmount will be set by backend ML service
      };
      console.log('Bill payload being sent to billing API:', billPayload);
      const billing = await dispatch(createBilling(billPayload)).then(res => res.payload || res);
      toast.success('🎉 Ride booked and bill created!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false
      });
      setTimeout(() => {
        navigate(`/billing/${billing._id}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Payment or billing failed. Try again.');
    }
  };

  return (
    <div style={pageStyle}>
      <ToastContainer />
      <h2>Confirm your payment</h2>
      <p><b>From:</b> {pickup?.address}</p>
      <p><b>To:</b> {dropoff?.address}</p>
      <p><b>Type:</b> {rideType}</p>
      <p><b>Total:</b> ${price}</p>

      <div style={cardStyle}>
        <p>Paying with <b>Google Pay</b></p>
      </div>

      <button style={payButton} onClick={handlePayment}>Confirm & Pay</button>
    </div>
  );
}

const pageStyle = {
  padding: '2rem',
  fontFamily: 'Arial'
};

const cardStyle = {
  background: '#f1f1f1',
  padding: '1rem',
  borderRadius: '8px',
  margin: '1rem 0'
};

const payButton = {
  backgroundColor: 'black',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  fontSize: '16px',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default Payment;

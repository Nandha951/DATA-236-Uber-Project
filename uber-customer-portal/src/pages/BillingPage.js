import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBilling } from '../features/billing/billingActions';
import { FaCreditCard, FaCarSide, FaClock, FaRoad } from 'react-icons/fa';

const BillingPage = () => {
  const { rideId } = useParams();
  const dispatch = useDispatch();
  const { loading, error, billingData } = useSelector((state) => state.billing);

  useEffect(() => {
    if (rideId) {
      dispatch(fetchBilling(rideId));
    }
  }, [dispatch, rideId]);

  console.log('BillingPage billingData:', billingData);

  // Map backend billing data to UI format, only include available fields
  function mapBillingData(raw) {
    if (!raw) return null;
    return {
      rider: raw.customerId || '',
      driver: raw.driverId ? { name: raw.driverId, photo: "https://randomuser.me/api/portraits/men/32.jpg" } : undefined,
      tripDate: raw.date ? new Date(raw.date).toLocaleString() : '',
      pickup: raw.sourceLocation || '',
      dropoff: raw.destinationLocation || '',
      cardType: "Personal Visa", // Hardcoded, remove if not needed
      total: typeof raw.totalAmount === 'number' ? raw.totalAmount : 0,
      fareBreakdown: {
        baseFare: typeof raw.totalAmount === 'number' ? raw.totalAmount : 0,
        // These are not available, so set to 0 or remove from UI if not needed
        distance: raw.distanceCovered || 0,
        time: 0,
        rounding: 0,
        discount: 0,
      },
      tripStats: {
        distance: raw.distanceCovered || 0,
        duration: '',
        avgSpeed: '',
      },
      mapUrl: '', // No map URL available
    };
  }

  const mappedBillingData = mapBillingData(billingData);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height: '300px'}}><span className="h5">Loading billing details...</span></div>;
  if (error) return <div className="text-danger text-center mt-4">{error}</div>;
  if (!mappedBillingData) return <div className="text-center mt-4">No billing data found.</div>;

  return (
    <div className="container py-5" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)'}}>
      <div className="card shadow-lg mx-auto" style={{maxWidth: '900px', borderRadius: '1.5rem'}}>
        <div className="card-body p-4">
          {/* Top Section: Two columns */}
          <div className="row g-4 align-items-center mb-4">
            {/* Left: Trip/Driver/Payment */}
            <div className="col-md-6">
              <h2 className="h3 fw-bold text-success mb-2">Thanks for riding <span className="text-dark">Uber</span>!</h2>
              <div className="text-secondary small mb-3">
                {mappedBillingData.rider && <div><span className="fw-semibold">Billed to:</span> {mappedBillingData.rider}</div>}
                {mappedBillingData.tripDate && <div><span className="fw-semibold">Trip Request Date:</span> {mappedBillingData.tripDate}</div>}
                {mappedBillingData.pickup && <div><span className="fw-semibold">Pickup Location:</span> {mappedBillingData.pickup}</div>}
                {mappedBillingData.dropoff && <div><span className="fw-semibold">Dropoff Location:</span> {mappedBillingData.dropoff}</div>}
              </div>
              {mappedBillingData.driver && (
                <div className="d-flex align-items-center mb-3">
                  <img src={mappedBillingData.driver.photo} alt="Driver" className="rounded-circle border border-2 border-secondary shadow-sm me-3" style={{width: '56px', height: '56px', objectFit: 'cover'}} />
                  <div>
                    <div className="fw-semibold text-uppercase small text-muted">Driver</div>
                    <div className="fw-semibold text-dark">{mappedBillingData.driver.name}</div>
                  </div>
                </div>
              )}
              {mappedBillingData.cardType && (
                <div className="d-flex align-items-center mb-2">
                  <FaCreditCard className="text-primary me-2" />
                  <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="me-2" style={{width: '32px', height: '32px'}} />
                  <span className="text-secondary fw-medium">{mappedBillingData.cardType}</span>
                </div>
              )}
              <div className="display-6 fw-bold text-dark mb-1">${mappedBillingData.total.toFixed(2)}</div>
              <div className="text-muted small">Billed to card</div>
            </div>
            {/* Right: Map */}
            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
              {mappedBillingData.mapUrl && <img src={mappedBillingData.mapUrl} alt="Trip Map" className="img-fluid rounded border border-2 border-primary shadow mb-2" style={{maxWidth: '320px', height: '180px', objectFit: 'cover'}} />}
            </div>
          </div>
          {/* Bottom Section: Fare Breakdown & Trip Stats side by side */}
          <div className="row g-4 mt-2">
            {/* Fare Breakdown */}
            <div className="col-md-6">
              <div className="card h-100 border-0 bg-light shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3 text-primary"><FaCarSide className="me-2" />Fare Breakdown</h5>
                  <div className="small text-secondary">
                    <div className="d-flex justify-content-between mb-1"><span>Base Fare</span><span>${mappedBillingData.fareBreakdown.baseFare.toFixed(2)}</span></div>
                    {/* Only show distance/time/rounding/discount if not zero */}
                    {mappedBillingData.fareBreakdown.distance !== 0 && <div className="d-flex justify-content-between mb-1"><span>Distance</span><span>${mappedBillingData.fareBreakdown.distance.toFixed(2)}</span></div>}
                    {mappedBillingData.fareBreakdown.time !== 0 && <div className="d-flex justify-content-between mb-1"><span>Time</span><span>${mappedBillingData.fareBreakdown.time.toFixed(2)}</span></div>}
                    {mappedBillingData.fareBreakdown.rounding !== 0 && <div className="d-flex justify-content-between mb-1"><span>Rounding Down</span><span className="text-danger">(${Math.abs(mappedBillingData.fareBreakdown.rounding).toFixed(2)})</span></div>}
                    {mappedBillingData.fareBreakdown.discount !== 0 && <div className="d-flex justify-content-between mb-1 fw-semibold text-success"><span>Discount subtotal</span><span>(${Math.abs(mappedBillingData.fareBreakdown.discount).toFixed(2)})</span></div>}
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold"><span>Total Fare</span><span>${mappedBillingData.total.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Trip Statistics */}
            <div className="col-md-6">
              <div className="card h-100 border-0 bg-light shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3 text-primary"><FaRoad className="me-2" />Trip Statistics</h5>
                  <div className="small text-secondary">
                    {mappedBillingData.tripStats.distance !== 0 && <div className="d-flex justify-content-between mb-1"><span>Distance</span><span className="fw-semibold">{mappedBillingData.tripStats.distance} miles</span></div>}
                    {mappedBillingData.tripStats.duration && <div className="d-flex justify-content-between mb-1"><span>Duration</span><span className="fw-semibold">{mappedBillingData.tripStats.duration}</span></div>}
                    {mappedBillingData.tripStats.avgSpeed && <div className="d-flex justify-content-between mb-1"><span>Average Speed</span><span className="fw-semibold">{mappedBillingData.tripStats.avgSpeed} mph</span></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// For development/demo: fallback mock data if no rideId is present
const mockBillingData = {
  rider: "Joe",
  driver: { name: "Mostafa", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  tripDate: "August 9, 2013 at 04:50pm",
  pickup: "98 N First St, San Jose, CA 95113",
  dropoff: "1 S Market St, San Jose, CA 95113",
  cardType: "Personal Visa",
  total: 24.00,
  fareBreakdown: {
    baseFare: 7.00,
    distance: 8.84,
    time: 9.06,
    rounding: -0.90,
    discount: -0.90,
  },
  tripStats: {
    distance: 3.34,
    duration: "19 minutes, 46 seconds",
    avgSpeed: 10.13,
  },
  mapUrl: "https://maps.googleapis.com/maps/api/staticmap?size=300x200&path=color:0x0000ff|weight:5|37.7749,-122.4194|37.8715,-122.2730&key=YOUR_API_KEY"
};

const BillingPageWrapper = (props) => {
  const { rideId } = useParams();
  if (!rideId) {
    // Show mock data if no rideId param
    return <BillingPage billingData={mockBillingData} />;
  }
  return <BillingPage {...props} />;
};

export default BillingPageWrapper; 
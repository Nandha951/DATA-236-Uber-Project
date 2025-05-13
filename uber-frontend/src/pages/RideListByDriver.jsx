import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRidesByDriver, updateRideStatus } from '../features/ride/rideThunks';
import { Container, Table, Spinner, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { FaCar, FaHistory, FaCheckCircle, FaSpinner, FaTimesCircle, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaUser } from 'react-icons/fa';
import ReviewForm from '../components/ReviewForm';
import axios from 'axios';

const RideListByDriver = ({ driverId }) => {
  const dispatch = useDispatch();
  const { driverRides, loading } = useSelector((state) => state.ride);
  const [reviewedRides, setReviewedRides] = useState({});
  const [reviewStatusLoading, setReviewStatusLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRidesByDriver(driverId));
  }, [dispatch, driverId]);

  useEffect(() => {
    const loadReviewedRides = async () => {
      if (!driverRides.length) return;
      setReviewStatusLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const completedRides = driverRides.filter(ride => ride.status === 'completed');

        const statuses = await Promise.all(completedRides.map(ride =>
          axios.get(`/api/rides/reviews/check/${ride.rideId}/${driverId}`, { headers })
            .then(res => ({ rideId: ride.rideId, hasReviewed: res.data?.hasReviewed || false }))
            .catch(() => ({ rideId: ride.rideId, hasReviewed: false }))
        ));

        const map = {};
        statuses.forEach(r => {
          map[r.rideId] = r.hasReviewed;
        });
        setReviewedRides(map);
      } catch (error) {
        console.error('Error loading review status:', error);
      } finally {
        setReviewStatusLoading(false);
      }
    };

    loadReviewedRides();
  }, [driverRides, driverId]);

  const handleStatusChange = (rideId, currentStatus) => {
    let nextStatus = currentStatus === 'accepted' ? 'in-progress' : 'completed';

    dispatch(updateRideStatus({ rideId, data: { status: nextStatus } }))
      .unwrap()
      .then(() => dispatch(fetchRidesByDriver(driverId)))
      .catch(err => alert('Ride update failed: ' + (err?.message || 'Unknown error')));
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return <FaCheckCircle className="text-success" />;
      case 'in-progress': return <FaSpinner className="text-warning" />;
      case 'cancelled': return <FaTimesCircle className="text-danger" />;
      default: return <FaSpinner className="text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  const activeRides = driverRides.filter(r => ['accepted', 'in-progress'].includes(r.status.toLowerCase()));
  const completedRides = driverRides.filter(r => r.status.toLowerCase() === 'completed');
  const cancelledRides = driverRides.filter(r => r.status.toLowerCase() === 'cancelled');

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <div className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FaCar size={32} />
              </div>
              <h2 className="fw-bold mb-2">My Rides</h2>
              <p className="text-muted">Manage your ride requests and track your progress</p>
            </div>

            {/* Dashboard Summary Cards */}
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaSpinner className="text-success" size={24} />
                    </div>
                    <h3 className="fw-bold text-success mb-2">{activeRides.length}</h3>
                    <p className="text-muted mb-0">Active Rides</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaCheckCircle className="text-success" size={24} />
                    </div>
                    <h3 className="fw-bold text-success mb-2">{completedRides.length}</h3>
                    <p className="text-muted mb-0">Completed Rides</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center">
                    <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaTimesCircle className="text-danger" size={24} />
                    </div>
                    <h3 className="fw-bold text-danger mb-2">{cancelledRides.length}</h3>
                    <p className="text-muted mb-0">Cancelled Rides</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Ride Table */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Ride ID</th>
                        <th>Customer</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Fare</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverRides.map((ride) => (
                        <tr key={ride.rideId}>
                          <td className="align-middle">#{ride.rideId}</td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                <FaUser className="text-primary" size={14} />
                              </div>
                              <div>
                                <h6 className="mb-0 fw-bold">{ride.customerName}</h6>
                                <small className="text-muted">ID: #{ride.customerId}</small>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            <div className="d-flex flex-column">
                              <span className="d-flex align-items-center text-muted mb-1">
                                <FaMapMarkerAlt className="me-2" size={14} />
                                {ride.pickupLocation?.address || 'N/A'}
                              </span>
                              <span className="d-flex align-items-center text-muted">
                                <FaMapMarkerAlt className="me-2" size={14} />
                                {ride.dropoffLocation?.address || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="align-middle">
                            <span className="d-flex align-items-center text-muted">
                              <FaCalendarAlt className="me-2" size={14} />
                              {new Date(ride.dateTime).toLocaleString()}
                            </span>
                          </td>
                          <td className="align-middle">
                            <span className="d-flex align-items-center fw-bold text-success">
                              <FaMoneyBillWave className="me-2" size={14} />
                              ${(ride.actualPrice || ride.estimatedPrice || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="align-middle">
                            <span className="d-flex align-items-center gap-2">
                              {getStatusIcon(ride.status)}
                              <span className="text-capitalize">{ride.status}</span>
                            </span>
                          </td>
                          <td className="align-middle">
                            {['accepted', 'in-progress'].includes(ride.status.toLowerCase()) && (
                              <Button
                                variant="success"
                                size="sm"
                                className="d-flex align-items-center gap-1"
                                onClick={() => handleStatusChange(ride.rideId, ride.status)}
                              >
                                {ride.status === 'accepted' ? (
                                  <>
                                    <FaSpinner size={14} />
                                    Start Ride
                                  </>
                                ) : (
                                  <>
                                    <FaCheckCircle size={14} />
                                    Complete Ride
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                          <td className="align-middle">
                            {ride.status === 'completed' && !reviewStatusLoading && !reviewedRides[ride.rideId] && (
                              <ReviewForm
                                rideId={ride.rideId}
                                reviewerId={driverId}
                                reviewerType="driver"
                                revieweeId={ride.customerId}
                                revieweeType="customer"
                                onSubmitted={() => setReviewedRides(prev => ({ ...prev, [ride.rideId]: true }))}
                              />
                            )}
                            {ride.status === 'completed' && reviewedRides[ride.rideId] && (
                              <Badge bg="secondary">Reviewed</Badge>
                            )}
                            {reviewStatusLoading && ride.status === 'completed' && (
                              <small>Loading...</small>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>
        {`
          .table th {
            font-weight: 600;
            border-top: none;
          }
          .table td {
            vertical-align: middle;
          }
          .card {
            transition: transform 0.2s ease-in-out;
          }
          .card:hover {
            transform: translateY(-5px);
          }
          .btn {
            transition: all 0.2s ease-in-out;
          }
          .btn:hover {
            transform: translateY(-2px);
          }
        `}
      </style>
    </div>
  );
};

export default RideListByDriver;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRidesByCustomer, updateRide, updateRideStatus } from '../features/ride/rideThunks';
import { useParams } from 'react-router-dom';
import { Container, Table, Spinner, Button, Modal, Form, Card, Row, Col, Badge, Tabs, Tab } from 'react-bootstrap';
import { FaCar, FaHistory, FaCheckCircle, FaSpinner, FaTimesCircle, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaEdit, FaUser, FaFilter, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';

const CustomerRides = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { customerRides, loading } = useSelector((state) => state.ride);

  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({ rideId: '', dropoffAddress: '', dateTime: '' });
  const [reviewedRides, setReviewedRides] = useState({});
  const [reviewStatusLoading, setReviewStatusLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchRidesByCustomer(id));
  }, [dispatch, id]);

  useEffect(() => {
    const loadReviewedRides = async () => {
      if (!customerRides.length) return;
      setReviewStatusLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const completedRides = customerRides.filter(r => r.status === 'completed');

        const reviewStatuses = await Promise.all(
          completedRides.map(ride =>
            axios
              .get(`/api/rides/reviews/check/${ride.rideId}/${id}`, { headers })
              .then(res => ({ rideId: ride.rideId, hasReviewed: res.data?.hasReviewed || false }))
              .catch(() => ({ rideId: ride.rideId, hasReviewed: false }))
          )
        );

        const reviewedMap = {};
        reviewStatuses.forEach(r => {
          reviewedMap[r.rideId] = r.hasReviewed;
        });
        setReviewedRides(reviewedMap);
      } catch (error) {
        console.error('Error checking review status:', error);
      } finally {
        setReviewStatusLoading(false);
      }
    };
    loadReviewedRides();
  }, [customerRides, id]);

  const handleCancel = (rideId) => {
    if (window.confirm('Are you sure you want to cancel this ride?')) {
      dispatch(updateRideStatus({ rideId, data: { status: 'cancelled' } }))
        .then(() => dispatch(fetchRidesByCustomer(id)))
        .catch(err => alert('Failed to cancel ride'));
    }
  };

  const handleEdit = (ride) => {
    setEditForm({
      rideId: ride.rideId,
      dropoffAddress: ride.dropoffLocation?.address || '',
      dateTime: ride.dateTime.slice(0, 16)
    });
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModalSubmit = async () => {
    const updatedData = {
      dropoffLocation: { address: editForm.dropoffAddress },
      dateTime: editForm.dateTime
    };
    try {
      const result = await dispatch(updateRide({ rideId: editForm.rideId, data: updatedData })).unwrap();
      if (result.message) alert(result.message);
      setShowModal(false);
      dispatch(fetchRidesByCustomer(id));
    } catch (err) {
      alert('Failed to update ride');
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <FaSpinner className="text-primary" />;
    switch (status.toLowerCase()) {
      case 'completed': return <FaCheckCircle className="text-success" />;
      case 'in-progress': return <FaSpinner className="text-warning" />;
      case 'cancelled': return <FaTimesCircle className="text-danger" />;
      default: return <FaSpinner className="text-primary" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return <Badge bg="success" className="px-3 py-2">Completed</Badge>;
      case 'in-progress': return <Badge bg="warning" className="px-3 py-2">In Progress</Badge>;
      case 'cancelled': return <Badge bg="danger" className="px-3 py-2">Cancelled</Badge>;
      default: return <Badge bg="primary" className="px-3 py-2">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const activeRides = customerRides.filter(r => ['accepted', 'in-progress'].includes(r.status));
  const completedRides = customerRides.filter(r => r.status === 'completed');
  const cancelledRides = customerRides.filter(r => r.status === 'cancelled');

  const filteredRides = customerRides.filter(ride => {
    const matchesSearch =
      (ride.rideId && ride.rideId.toString().includes(searchTerm)) ||
      (ride.driverName && ride.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ride.pickupLocation?.address && ride.pickupLocation.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ride.dropoffLocation?.address && ride.dropoffLocation.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && ['accepted', 'in-progress'].includes(ride.status)) ||
      (activeTab === 'completed' && ride.status === 'completed') ||
      (activeTab === 'cancelled' && ride.status === 'cancelled');

    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FaCar size={32} />
              </div>
              <h2 className="fw-bold mb-2">My Rides</h2>
              <p className="text-muted">Track your ride history and manage active rides</p>
            </div>

            {/* Status Cards */}
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 status-card">
                  <Card.Body className="text-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                      <FaSpinner className="text-primary" size={24} />
                    </div>
                    <h3 className="fw-bold text-primary mb-2">{activeRides.length}</h3>
                    <p className="text-muted mb-0">Active Rides</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 status-card">
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
                <Card className="border-0 shadow-sm h-100 status-card">
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

            {/* Search and Filter */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="search-box">
                      <FaSearch className="text-muted position-absolute" style={{ top: '50%', left: '15px', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search rides..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                      className="mb-0"
                    >
                      <Tab eventKey="all" title="All Rides" />
                      <Tab eventKey="active" title="Active" />
                      <Tab eventKey="completed" title="Completed" />
                      <Tab eventKey="cancelled" title="Cancelled" />
                    </Tabs>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Ride Table */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Ride ID</th>
                        <th>Driver</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Fare</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRides.map((ride) => (
                        <tr key={ride.rideId} className="ride-row">
                          <td className="align-middle">#{ride.rideId}</td>
                          <td className="align-middle">
                            {ride.driverName ? (
                              <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                  <FaUser className="text-success" size={14} />
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-bold">{ride.driverName}</h6>
                                  <small className="text-muted">ID: #{ride.driverId}</small>
                                </div>
                              </div>
                            ) : <span className="text-muted">Not assigned</span>}
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
                            <span className="d-flex align-items-center fw-bold text-primary">
                              <FaMoneyBillWave className="me-2" size={14} />
                              ${(ride.actualPrice || ride.estimatedPrice || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="align-middle">
                            {getStatusBadge(ride.status)}
                          </td>
                          <td className="align-middle">
                            {['accepted', 'in-progress'].includes((ride.status || '').toLowerCase()) && (
                              <div className="d-flex gap-2">
                                <Button variant="primary" size="sm" className="action-btn" onClick={() => handleEdit(ride)}>
                                  <FaEdit size={14} /> Edit
                                </Button>
                                <Button variant="danger" size="sm" className="action-btn" onClick={() => handleCancel(ride.rideId)}>
                                  <FaTimesCircle size={14} /> Cancel
                                </Button>
                              </div>
                            )}
                          </td>
                          <td className="align-middle">
                            {ride.status === 'completed' && !reviewStatusLoading && !reviewedRides[ride.rideId] && (
                              <ReviewForm
                                rideId={ride.rideId}
                                reviewerId={id}
                                reviewerType="customer"
                                revieweeId={ride.driverId}
                                revieweeType="driver"
                                onSubmitted={() => setReviewedRides(prev => ({ ...prev, [ride.rideId]: true }))}
                              />
                            )}
                            {ride.status === 'completed' && reviewedRides[ride.rideId] && (
                              <Badge bg="secondary" className="px-3 py-2">Reviewed</Badge>
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

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Ride</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><FaMapMarkerAlt className="me-2" />Dropoff Location</Form.Label>
              <Form.Control
                type="text"
                name="dropoffAddress"
                value={editForm.dropoffAddress}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><FaCalendarAlt className="me-2" />Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dateTime"
                value={editForm.dateTime}
                onChange={handleModalChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleModalSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .table th { 
            font-weight: 600; 
            border-top: none;
            background-color: #f8f9fa;
            padding: 1rem;
          }
          .table td { 
            vertical-align: middle;
            padding: 1rem;
          }
          .card { 
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            border-radius: 1rem;
          }
          .card:hover { 
            transform: translateY(-5px);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          }
          .btn { 
            transition: all 0.2s ease-in-out;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
          }
          .btn:hover { 
            transform: translateY(-2px);
          }
          .status-card {
            background: linear-gradient(145deg, #ffffff, #f8f9fa);
          }
          .search-box {
            position: relative;
          }
          .search-box input {
            border-radius: 2rem;
            padding-left: 2.5rem;
            border: 1px solid #dee2e6;
            transition: all 0.2s ease-in-out;
          }
          .search-box input:focus {
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
            border-color: #86b7fe;
          }
          .ride-row {
            transition: background-color 0.2s ease-in-out;
          }
          .ride-row:hover {
            background-color: #f8f9fa;
          }
          .action-btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
          }
          .nav-tabs .nav-link {
            border: none;
            color: #6c757d;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease-in-out;
          }
          .nav-tabs .nav-link:hover {
            color: #0d6efd;
            background-color: #f8f9fa;
          }
          .nav-tabs .nav-link.active {
            color: #0d6efd;
            background-color: #e7f1ff;
            font-weight: 600;
          }
          .badge {
            font-weight: 500;
            letter-spacing: 0.5px;
          }
        `}
      </style>
    </div>
  );
};

export default CustomerRides;

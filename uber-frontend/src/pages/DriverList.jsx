import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers, deleteDriver } from '../features/driver/driverThunks';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Table, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaCar, FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';

const DriverList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { drivers, loading } = useSelector((state) => state.driver);

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      dispatch(deleteDriver(id));
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                  <FaCar size={24} />
                </div>
                <div>
                  <h2 className="fw-bold mb-1">Drivers</h2>
                  <p className="text-muted mb-0">Manage your driver network</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                size="lg"
                className="d-flex align-items-center gap-2"
                onClick={() => navigate('/drivers/new')}
              >
                <FaPlus />
                Add Driver
              </Button>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : drivers.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <FaCar size={48} className="text-muted mb-3" />
                  <h4 className="text-muted">No drivers found</h4>
                  <p className="text-muted mb-0">Add your first driver to get started</p>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Driver</th>
                          <th>Contact</th>
                          <th>License</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drivers.map((driver) => (
                          <tr key={driver._id}>
                            <td className="align-middle">
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                  <FaUser className="text-primary" />
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-bold">{driver.name}</h6>
                                  <small className="text-muted">ID: #{driver._id}</small>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle">
                              <div className="d-flex flex-column">
                                <span className="d-flex align-items-center text-muted mb-1">
                                  <FaEnvelope className="me-2" size={14} />
                                  {driver.email}
                                </span>
                                <span className="d-flex align-items-center text-muted">
                                  <FaPhone className="me-2" size={14} />
                                  {driver.phone}
                                </span>
                              </div>
                            </td>
                            <td className="align-middle">
                              <span className="d-flex align-items-center text-muted">
                                <FaIdCard className="me-2" size={14} />
                                {driver.licenseNumber}
                              </span>
                            </td>
                            <td className="align-middle">
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="d-flex align-items-center gap-1"
                                  onClick={() => navigate(`/drivers/${driver._id}/edit-profile`)}
                                >
                                  <FaEdit size={14} />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="d-flex align-items-center gap-1"
                                  onClick={() => handleDelete(driver._id)}
                                >
                                  <FaTrash size={14} />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default DriverList;

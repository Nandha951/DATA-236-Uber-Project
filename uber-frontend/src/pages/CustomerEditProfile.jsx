import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer } from '../features/customer/customerThunks';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const CustomerEditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authCustomer } = useSelector((state) => state.customer);

  const [form, setForm] = useState({
    firstName: authCustomer?.firstName || '',
    lastName: authCustomer?.lastName || '',
    email: authCustomer?.email || '',
    phoneNumber: authCustomer?.phoneNumber || '',
    address: authCustomer?.address || '',
    city: authCustomer?.city || '',
    state: authCustomer?.state || '',
    zipCode: authCustomer?.zipCode || '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCustomer({ id: authCustomer.customerId, data: form }))
      .unwrap()
      .then(() => {
        alert('Profile updated!');
        navigate(`/customers/${authCustomer.customerId}/profile`);
      })
      .catch((err) => alert(err.message || 'Update failed'));
  };

  return (
    <Container className="mt-4">
      <h2>Edit Profile</h2>
      <Form onSubmit={handleSubmit}>
        {["firstName", "lastName", "email", "phoneNumber", "address", "city", "state", "zipCode"].map((field) => (
          <Form.Group className="mb-3" key={field}>
            <Form.Label>{field}</Form.Label>
            <Form.Control
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </Form.Group>
        ))}
        <Button type="submit">Save Changes</Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>Cancel</Button>
      </Form>
    </Container>
  );
};

export default CustomerEditProfile; 
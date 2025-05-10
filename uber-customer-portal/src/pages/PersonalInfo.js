import React from 'react';
import { useSelector } from 'react-redux';

const PersonalInfo = () => {
  const user = useSelector(state => state.user.userInfo);

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">Personal Info</h3>

      <div className="text-center mb-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="profile"
          width="100"
          className="rounded-circle"
        />
      </div>

      <div className="list-group shadow">
        <div className="list-group-item">
          <strong>Name:</strong> {user?.firstName} {user?.lastName}
        </div>
        <div className="list-group-item">
          <strong>Customer ID:</strong> {user?._id}
        </div>
        <div className="list-group-item">
          <strong>SSN:</strong> {user?.ssn}
        </div>
        <div className="list-group-item">
          <strong>Phone Number:</strong> {user?.phone}
        </div>
        <div className="list-group-item">
          <strong>Email:</strong> {user?.email}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

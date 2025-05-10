import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Account = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.userInfo);

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4">Uber Account</h3>

      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-md-3">
          <ul className="list-group">
            <li className="list-group-item active">Home</li>
            <li
              className="list-group-item list-group-item-action"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/account/personal-info')}
            >
              Personal Info
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="text-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="profile"
              width="80"
              className="rounded-circle mb-2"
            />
            <h4 className="fw-bold">{user?.firstName || 'Customer'} {user?.lastName}</h4>
            <p className="text-muted">{user?.email}</p>
            <p className="text-muted">Member since: May 2025</p>
            <p className="text-muted">Last login: 06 May 2025</p>
          </div>

          {/* Personal Info Tile */}
          <div className="d-flex justify-content-center text-center">
            <div
              className="border rounded p-3 m-2 bg-light"
              style={{ width: '160px', cursor: 'pointer' }}
              onClick={() => navigate('/account/personal-info')}
            >
              <div style={{ fontSize: '24px' }}>👤</div>
              <p className="fw-semibold mt-2 mb-0">Personal Info</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

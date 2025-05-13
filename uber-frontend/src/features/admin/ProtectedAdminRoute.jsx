import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/admin/login" />;
};

export default ProtectedAdminRoute;

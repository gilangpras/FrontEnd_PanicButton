import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const RequireAuth = ({ redirectPath }) => {
  const isAuthenticated = localStorage.getItem('Token');

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  // Periksa role pengguna di sini dan arahkan ke halaman yang sesuai
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'admin') {
    return <Navigate to="/home" />;
  } else  if (userRole === 'super-admin') {
    return <Navigate to="/home" />;
  } else if (userRole === 'user') {
    return <Navigate to="/homeuser" />;
  }

  return <Outlet />;
};

export default RequireAuth;

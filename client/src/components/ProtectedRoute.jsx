import React, { useContext } from 'react'; // ADD 'useContext' HERE
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Fallback to localStorage if state is refreshing
  const backupUser = JSON.parse(localStorage.getItem('userInfo'));
  const activeUser = user || backupUser;

  if (loading) return <div className="text-white p-10 font-bold">Verifying System Access...</div>;

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if the role (e.g., 'user') is allowed for this route
  if (allowedRoles && !allowedRoles.includes(activeUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
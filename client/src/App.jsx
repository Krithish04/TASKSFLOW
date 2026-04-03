import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/User/UserDashboard";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Layout from './components/LAyout';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Public Login Route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* 2. Protected Routes Wrapper */}
          <Route element={<ProtectedRoute allowedRoles={['user', 'manager', 'admin']} />}>
            <Route element={<Layout />}>
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

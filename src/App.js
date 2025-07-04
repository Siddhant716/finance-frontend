import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, CircularProgress } from '@mui/material';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// PrivateRoute component
function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// RoleRedirect component
function RoleRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }
  
  // If no user is authenticated, show login page
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If user is authenticated, redirect based on role
  if (user?.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  
  if (user?.role === 'user') {
    return <Navigate to="/expenses" />;
  }
  
  // Fallback to login if role is unknown
  return <Navigate to="/login" />;
}



function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Expense Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/expenses" element={<PrivateRoute roles={['user']}><Expenses /></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute roles={['user']}><Budgets /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute roles={['user']}><Reports /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/" element={<RoleRedirect />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

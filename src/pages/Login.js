import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();



  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, boxShadow: 2, bgcolor: 'white', borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            setError('');
            try {
              console.log('Attempting login with:', values);
              
              const response = await api.post('/auth/login', values);
              console.log('Login response:', response);
              
              // Wait a moment for cookies to be set
              await new Promise(resolve => setTimeout(resolve, 100));
              
              console.log('Calling login() to fetch user data...');
              await login();
              console.log('Login process completed');
              
              // Get the updated user data and navigate
              try {
                const userResponse = await api.get('/users/showMe');
                const userData = userResponse.data.user || userResponse.data;
                console.log('Current user after login:', userData);
                
                if (userData && userData.role) {
                  if (userData.role === 'user') {
                    navigate('/expenses');
                  } else if (userData.role === 'admin') {
                    navigate('/admin');
                  }
                }
              } catch (navErr) {
                console.error('Error getting user data for navigation:', navErr);
              }
            } catch (err) {
              console.error('Login error:', err);
              console.error('Error response:', err.response);
              setError(err.response?.data?.msg || err.response?.data?.message || 'Login failed');
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field as={TextField} name="email" label="Email" fullWidth margin="normal" />
              <Field as={TextField} name="password" label="Password" type="password" fullWidth margin="normal" />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login; 
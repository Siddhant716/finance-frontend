import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';

const Signup = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, boxShadow: 2, bgcolor: 'white', borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>Sign Up</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            setError(''); setSuccess('');
            try {
              await api.post('/auth/register', values);
              setSuccess('Registration successful! Please log in.');
              setTimeout(() => navigate('/login'), 1500);
            } catch (err) {
              setError(err.response?.data?.message || 'Registration failed');
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field as={TextField} name="name" label="Name" fullWidth margin="normal" />
              <Field as={TextField} name="email" label="Email" fullWidth margin="normal" />
              <Field as={TextField} name="password" label="Password" type="password" fullWidth margin="normal" />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account? <Link to="/login">Login</Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Signup; 
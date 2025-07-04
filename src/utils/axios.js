import axios from 'axios';

const api = axios.create({
  baseURL: 'https://finance-backend-1-47be.onrender.com/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // For cookie-based authentication, we don't need to manually add Authorization headers
  // The browser automatically sends cookies with requests when withCredentials: true
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 
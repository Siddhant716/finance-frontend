import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if user is authenticated by calling /users/showMe
    const checkAuth = async () => {
      try {
        const res = await api.get('/users/showMe');
        const userData = res.data.user || res.data;
        setUser(userData);
      } catch (err) {
        console.error('Initial auth check error:', err);
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // login and logout can be used to trigger re-check
  const login = async () => {
    try {
      console.log('AuthContext: Calling /users/showMe...');
      const res = await api.get('/users/showMe');
      console.log('AuthContext: /users/showMe response:', res.data);
      
      const userData = res.data.user || res.data;
      console.log('AuthContext: Setting user data:', userData);
      setUser(userData);
    } catch (err) {
      console.error('AuthContext: Login check error:', err);
      console.error('AuthContext: Error response:', err.response);
      setUser(null);
    }
  };
  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...');
      console.log('AuthContext: Cookies before logout:', document.cookie);
      
      const response = await api.get('/auth/logout');
      console.log('AuthContext: Logout API response:', response);
    } catch (err) {
      console.error('AuthContext: Logout API error:', err);
      console.error('AuthContext: Logout error response:', err.response);
    } finally {
      console.log('AuthContext: Clearing user state...');
      setUser(null);
      
      // Manual cookie clearing as fallback
      try {
        console.log('AuthContext: Cookies after logout API call:', document.cookie);
        
        // Clear the specific token cookie with the exact domain and path
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=finance-backend-1-47be.onrender.com;';
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Also clear any other possible auth cookies
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        console.log('AuthContext: Cookies after manual clearing:', document.cookie);
        console.log('AuthContext: Manual cookie clearing completed');
        
        // Force page reload to clear HTTP-only cookies
        setTimeout(() => {
          console.log('AuthContext: Reloading page to clear HTTP-only cookies...');
          window.location.reload();
        }, 500);
      } catch (cookieErr) {
        console.error('AuthContext: Error clearing cookies manually:', cookieErr);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
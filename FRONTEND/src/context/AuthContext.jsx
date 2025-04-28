import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Manual JWT decoding function
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.log('Token is expired');
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && decoded.role === 'customer') {
        console.log('User is authenticated as customer');
        setIsLoggedIn(true);
      } else {
        console.log('Invalid or expired token, clearing storage');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } else {
      console.log('No token found');
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();

    // Handle storage changes (e.g., logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        console.log('Storage event detected, checking auth status');
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = () => {
    console.log('Login triggered');
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log('Logout triggered');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
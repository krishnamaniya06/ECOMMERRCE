import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Configure axios to include credentials with every request
  axios.defaults.withCredentials = true;

  // Verify authentication status with the server
  const verifyAuth = async (token) => {
    if (!token) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    }
    
    try {
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('http://localhost:5000/api/user-profile');
      
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth verification failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    }
  };

  // Function to check auth status - can be called from any component
  const checkAuthStatus = async (forceCheck = false) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // If we already have user data and not forcing a check
    if (!forceCheck && currentUser && isAuthenticated) {
      return true;
    }
    
    if (token) {
      // Set default authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      if (userData && !forceCheck) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      } else {
        // Verify token with server
        return await verifyAuth(token);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  // Auth context value
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
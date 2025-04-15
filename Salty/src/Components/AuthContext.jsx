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

  // Configure axios to include credentials with every request
  axios.defaults.withCredentials = true;

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token) {
        // Set default authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        } else {
          // If we have token but no user data, try to get user profile
          try {
            const response = await axios.get('http://localhost:5000/api/user-profile');
            if (response.data && response.data.user) {
              setCurrentUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            // If token is invalid, clear everything
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
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
    }
    
    return response;
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
    }
  };

  // Auth context value
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
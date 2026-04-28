import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup axios default config
  const setupAxios = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setupAxios(parsedUser.token);
    } else {
      setupAxios(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setupAxios(null); // Ensure fresh instance
      const res = await axios.post('/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setupAxios(res.data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      setupAxios(null);
      const res = await axios.post('/auth/signup', { name, email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setupAxios(res.data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setupAxios(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const AuthContext = createContext();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [token]);

  const register = async (email, password, name) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
      });
      
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

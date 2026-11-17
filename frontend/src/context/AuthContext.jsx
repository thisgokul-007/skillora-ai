import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillora_token') || null);
  const [loading, setLoading] = useState(false);
  
  // Dark / Light Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('skillora_theme') || 'light');

  // Global filters for institutional views
  const [filters, setFilters] = useState({
    academic_year: '2026-2027',
    semester: 'all',
    department: 'all'
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('skillora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('skillora_token', token);
      localStorage.setItem('skillora_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/demo-login', { role });
      const { token, user } = res.data;
      localStorage.setItem('skillora_token', token);
      localStorage.setItem('skillora_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('skillora_token');
    localStorage.removeItem('skillora_user');
    setToken(null);
    setUser(null);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      theme,
      toggleTheme,
      filters,
      updateFilters,
      login,
      demoLogin,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

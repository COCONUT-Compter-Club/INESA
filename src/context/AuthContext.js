'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulasi pengguna login untuk pengujian
    console.log('AuthContext: Simulating logged-in user');
    setUser({ role: 'admin' });
    Cookies.set('auth_token', 'dummy_token', { expires: 7 });
  }, []);

  const login = async (credentials) => {
    setUser({ role: 'admin' });
    Cookies.set('auth_token', 'dummy_token', { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
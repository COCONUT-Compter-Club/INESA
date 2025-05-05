'use client';

import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
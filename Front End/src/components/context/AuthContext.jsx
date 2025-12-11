import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    } catch (e) {}
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
    } catch (e) {}
  }, [user]);

  const login = (userObj, jwt) => {
    setUser(userObj);
    setToken(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

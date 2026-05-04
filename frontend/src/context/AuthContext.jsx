import React, { createContext, useState, useCallback, useEffect } from 'react';

import {
  authApi,
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from '../utils/api';

const AuthContext = createContext();

const normalizeRole = (role) => {
  // Fetch fallback from localStorage in case the backend omitted the role
  const fallbackRole = localStorage.getItem('userRole') || 'user';
  const value = String(role || fallbackRole).toLowerCase();

  if (value === 'customer') {
    return 'user';
  }

  return value;
};

const normalizeUser = (user = {}) => ({
  ...user,
  role: normalizeRole(user.role),
  name:
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.shopName ||
    'LocalKart User',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextUser, token) => {
    const normalizedUser = normalizeUser(nextUser);
    const role = normalizeRole(normalizedUser.role);

    setUser(normalizedUser);
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('userRole', role);

    if (token) {
      setStoredAuthToken(token);
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    clearStoredAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      const token = getStoredAuthToken();
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setIsLoading(false);
        return;
      }

      if (storedUser && token) {
        try {
          const parsedUser = normalizeUser(JSON.parse(storedUser));
          setUser(parsedUser);
          setUserRole(normalizeRole(parsedUser.role));
          // Don't set isAuthenticated = true yet; wait for server verification
        } catch (e) {
          clearSession();
          setIsLoading(false);
          return;
        }
      }

      try {
        const currentUser = await authApi.getCurrentUser();
        persistSession(currentUser, token);
      } catch (error) {
        // Silently clear session if the token is invalid/expired
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [clearSession, persistSession]);

  const login = useCallback((authPayload) => {
    // Support BOTH nested {user: {}, token: ""} AND flat {userId, email, token} responses from Spring Boot
    const userData = authPayload.user ? authPayload.user : authPayload;
    persistSession(userData, authPayload.token);
  }, [persistSession]);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    clearSession();
  }, [clearSession]);

  const updateUser = useCallback((nextUser) => {
    const normalizedUser = normalizeUser(nextUser);
    setUser(normalizedUser);
    setUserRole(normalizeRole(normalizedUser.role));
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('userRole', normalizeRole(normalizedUser.role));
  }, []);

  const value = {
    user,
    userRole,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

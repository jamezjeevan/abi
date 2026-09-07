import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../config/supabase';
import { ROLE_HOME_ROUTES } from '../config/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const session = await authService.getInitialSession();
        if (session && isMounted) {
          setUser(session.user);
          setProfile(session.profile);
          setRole(session.role);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const subscription = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRole(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        const currentSession = await authService.getInitialSession();
        if (currentSession && isMounted) {
          setUser(currentSession.user);
          setProfile(currentSession.profile);
          setRole(currentSession.role);
        }
      }
    });

    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async ({ identifier, password, selectedRole }) => {
    const session = await authService.login({ identifier, password, selectedRole });
    setUser(session.user);
    setProfile(session.profile);
    setRole(session.role);
    return session;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const getHomeRoute = () => {
    if (!role) return '/login';
    return ROLE_HOME_ROUTES[role] || '/login';
  };

  const value = {
    user,
    profile,
    role,
    loading,
    login,
    logout,
    getHomeRoute,
    isAuthenticated: Boolean(user && role),
    isLiveSupabase: isSupabaseConfigured()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME_ROUTES } from '../config/constants';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-medium tracking-wide text-slate-300">
            Verifying secure session & role authorization...
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role validation check
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(`Access blocked: user with role "${role}" attempted accessing unauthorized route "${location.pathname}".`);
    // Redirect to Unauthorized view, passing their attempted route and actual role
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          attemptedPath: location.pathname,
          userRole: role,
          homeRoute: ROLE_HOME_ROUTES[role] 
        }} 
        replace 
      />
    );
  }

  return children;
};

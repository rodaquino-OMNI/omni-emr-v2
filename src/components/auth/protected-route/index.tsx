
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import HipaaBanner from './HipaaBanner';
import OfflineModeBanner from './OfflineModeBanner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="loading-spinner"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has the required role
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Check if user has the required permissions
  if (requiredPermissions && user && !requiredPermissions.some(perm => user.permissions.includes(perm))) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <HipaaBanner />
      <OfflineModeBanner />
      {children}
    </>
  );
};

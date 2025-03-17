
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { roleRouteConfig } from '@/registry/RoleBasedRouter';

interface RoleBasedRoutesProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermission?: string;
  fallbackPath?: string;
}

/**
 * A wrapper component that renders children only if the user has the required role and permission
 * Otherwise, it redirects to the fallback path with state information about the requirement
 */
export const RoleBasedRoutes: React.FC<RoleBasedRoutesProps> = ({
  children,
  requiredRoles = [],
  requiredPermission,
  fallbackPath = '/unauthorized'
}) => {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  
  // Check if the user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Check if the user has the required role
  const hasRequiredRole = requiredRoles.length === 0 || 
                          (user.role && requiredRoles.includes(user.role));
  
  // Check if the user has the required permission
  const hasRequiredPermission = !requiredPermission || hasPermission(requiredPermission);
  
  // If user doesn't have the required role or permission, redirect
  if (!hasRequiredRole || !hasRequiredPermission) {
    return (
      <Navigate
        to={fallbackPath}
        state={{
          from: location.pathname,
          requiredRole: requiredRoles.join(', '),
          requiredPermission
        }}
        replace
      />
    );
  }
  
  // Render the children if user has access
  return <>{children}</>;
};

export default RoleBasedRoutes;

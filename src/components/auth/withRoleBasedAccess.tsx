
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useRoleBasedRouteAccess from '@/hooks/useRoleBasedRouteAccess';

interface WithRoleBasedAccessProps {
  requiredPermission?: string;
  requiredRoles?: string[];
  requireSector?: boolean;
  patientId?: string;
  redirectTo?: string;
  children: React.ReactNode;
}

/**
 * Higher-order component that checks if user has access to a component based on role, permissions, sector, etc.
 * If access is denied, redirects to the appropriate page
 */
export const WithRoleBasedAccess: React.FC<WithRoleBasedAccessProps> = ({
  requiredPermission,
  requiredRoles = [],
  requireSector = false,
  patientId,
  redirectTo = '/unauthorized',
  children
}) => {
  const location = useLocation();
  const accessStatus = useRoleBasedRouteAccess({
    requiredPermission,
    requiredRoles,
    requireSector,
    patientId
  });
  
  // If access is granted, render the children
  if (accessStatus.hasAccess) {
    return <>{children}</>;
  }
  
  // Redirect based on the reason for access denial
  if (accessStatus.reason === 'not_authenticated') {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  if (accessStatus.reason === 'needs_sector') {
    return <Navigate to="/sectors" replace />;
  }
  
  // For all other access denied reasons, redirect to the specified redirectTo
  return (
    <Navigate 
      to={redirectTo} 
      state={{ 
        from: location.pathname,
        reason: accessStatus.reason,
        requiredPermission,
        requiredRoles
      }} 
      replace 
    />
  );
};

/**
 * Higher-order component creator for role-based access control
 */
export const withRoleBasedAccess = (options: Omit<WithRoleBasedAccessProps, 'children'>) => {
  return function WithRBAC(Component: React.ComponentType<any>) {
    return function RoleBasedComponent(props: any) {
      return (
        <WithRoleBasedAccess {...options}>
          <Component {...props} />
        </WithRoleBasedAccess>
      );
    };
  };
};

export default withRoleBasedAccess;

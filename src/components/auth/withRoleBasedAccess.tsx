
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useRoleBasedRouteAccess from '@/hooks/useRoleBasedRouteAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSectorContext } from '@/hooks/useSectorContext';

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
  const { t } = useTranslation();
  const { selectedSector } = useSectorContext();
  
  const accessStatus = useRoleBasedRouteAccess({
    requiredPermission,
    requiredRoles,
    requireSector: false, // We don't redirect, we just show a warning
    patientId
  });
  
  // If access is granted, render the children
  if (accessStatus.hasAccess) {
    // Check if this component needs a sector but doesn't have one
    const needsSector = requireSector && !selectedSector;
    
    return (
      <>
        {needsSector && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('sectorSelectionRequired', 'Please select a sector from the sidebar to access all features')}
            </AlertDescription>
          </Alert>
        )}
        {children}
      </>
    );
  }
  
  // Redirect based on the reason for access denial
  if (accessStatus.reason === 'not_authenticated') {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
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

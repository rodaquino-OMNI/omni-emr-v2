
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleBasedRouteProps {
  element: React.ReactElement;
  requiredRoles?: string[];
  requiredPermission?: string;
  fallbackPath?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  element,
  requiredRoles = [],
  requiredPermission,
  fallbackPath = '/unauthorized'
}) => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const location = useLocation();
  
  // Check if user has the required role
  const hasRequiredRole = user && 
    (requiredRoles.length === 0 || 
     (user.role && requiredRoles.includes(user.role)));
  
  // Check if user has the required permission
  const hasRequiredPermission = !requiredPermission || 
    permissions.hasPermission(requiredPermission);
  
  // Allow access if user has the required role and permission
  if (hasRequiredRole && hasRequiredPermission) {
    return element;
  }
  
  // Otherwise, redirect to fallback path
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
};

// Define a type for route config items
export interface RouteConfig {
  path: string;
  roles: string[];
  permissions: string[];
  component: React.ComponentType<any>;
}

// Define the route configuration
export const roleRouteConfig: RouteConfig[] = [
  {
    path: '/dashboard',
    roles: ['all'],
    permissions: ['dashboard:view'],
    component: React.lazy(() => import('@/pages/Dashboard'))
  },
  {
    path: '/patients',
    roles: ['doctor', 'nurse', 'administrative', 'pharmacist'],
    permissions: ['patients:view'],
    component: React.lazy(() => import('@/pages/Patients'))
  },
  {
    path: '/medications',
    roles: ['doctor', 'nurse', 'pharmacist'],
    permissions: ['medications:view'],
    component: React.lazy(() => import('@/pages/Medications'))
  },
  {
    path: '/prescribe',
    roles: ['doctor', 'specialist'],
    permissions: ['medications:prescribe'],
    component: React.lazy(() => import('@/pages/PrescribeMedication'))
  },
  {
    path: '/clinical-documentation',
    roles: ['doctor', 'nurse', 'specialist'],
    permissions: ['notes:view'],
    component: React.lazy(() => import('@/pages/ClinicalDocumentation'))
  },
  {
    path: '/admin',
    roles: ['admin', 'system_administrator'],
    permissions: ['admin:access'],
    component: React.lazy(() => import('@/pages/Admin'))
  }
];

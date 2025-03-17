
import { useLocation } from 'react-router-dom';
import { User } from '@/types/auth';

interface UseRoutePermissionsProps {
  user: User | null;
  requiredPermission?: string;
  requiredRole?: string;
}

export const useRoutePermissions = ({
  user,
  requiredPermission,
  requiredRole
}: UseRoutePermissionsProps) => {
  const location = useLocation();
  
  // Check if current route is dashboard or root
  const isRootOrDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  
  // Check if user has the required permission
  const hasPermission = () => {
    if (!requiredPermission || !user) return true;
    
    // Admin has all permissions
    if (user.role === 'admin' || user.role === 'system_administrator') return true;
    
    // Check user permissions
    return user.permissions?.includes(requiredPermission) || user.permissions?.includes('all') || false;
  };
  
  // Check if user has the required role
  const hasRole = () => {
    if (!requiredRole || !user) return true;
    return user.role === requiredRole;
  };
  
  // User must have both the required permission and role if specified
  const hasRequired = hasPermission() && hasRole();

  return {
    isRootOrDashboard,
    hasRequired
  };
};

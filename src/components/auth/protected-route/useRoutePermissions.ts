
import { useLocation } from 'react-router-dom';
import { User } from '@/types/auth';
import { hasPermission } from '@/utils/permissionUtils';

interface RoutePermissionsProps {
  user: User | null;
  requiredPermission?: string;
  requiredRole?: string | string[];
}

export const useRoutePermissions = ({ 
  user, 
  requiredPermission,
  requiredRole 
}: RoutePermissionsProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Check if the current route is the root or dashboard
  const isRootOrDashboard = 
    pathname === '/' || 
    pathname === '/dashboard' || 
    pathname === '/home';
  
  // Determine if the user meets the permission requirements
  let hasRequired = true;
  
  // If a specific permission is required, check if the user has it
  if (requiredPermission) {
    hasRequired = hasPermission(user, requiredPermission);
  }
  
  // If a specific role is required, check if the user has it
  if (requiredRole && hasRequired && user) {
    if (Array.isArray(requiredRole)) {
      hasRequired = requiredRole.includes(user.role);
    } else {
      hasRequired = user.role === requiredRole;
    }
  }
  
  return {
    isRootOrDashboard,
    hasRequired
  };
};

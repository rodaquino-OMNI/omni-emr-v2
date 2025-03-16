
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useRoutePermissions = (requiredPermission?: string) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  
  // Check if the current route is the root or dashboard
  const isRootOrDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  
  // Check if the user has the required permission
  const hasPermission = requiredPermission ? auth.hasPermission(requiredPermission) : true;
  
  // If the user doesn't have permission, redirect to unauthorized page
  if (requiredPermission && !hasPermission) {
    navigate('/unauthorized', { replace: true });
    return { isRootOrDashboard: false, hasPermission: false };
  }
  
  return { isRootOrDashboard, hasPermission };
};

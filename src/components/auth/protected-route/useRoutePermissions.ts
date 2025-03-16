
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '@/types/auth';
import { toast } from 'sonner';
import { Language } from '@/types/auth';
import { LockIcon } from 'lucide-react';

interface UseRoutePermissionsProps {
  user: User | null;
  requiredPermission?: string;
  requiredRole?: string;
  hasPermission: (permission: string) => boolean;
  language: Language;
  isAuthenticated: boolean;
}

export const useRoutePermissions = ({
  user,
  requiredPermission,
  requiredRole,
  hasPermission,
  language,
  isAuthenticated
}: UseRoutePermissionsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if the current route is the root or dashboard
  const isRootOrDashboard = (location.pathname === '/' || location.pathname === '/dashboard');
  
  // Check for role-specific routing if a patient page is being accessed
  const isPatientPage = location.pathname.includes('/patients/') && location.pathname !== '/patients';
  const patientIdFromUrl = isPatientPage ? location.pathname.split('/')[2] : null;
  
  // Determine if we need to redirect based on user role and patient page
  const shouldRedirect = () => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return { redirect: true, path: '/login', replace: true, state: { returnUrl: location.pathname } };
    }
    
    // If accessing a specific patient view
    if (isPatientPage && patientIdFromUrl && user?.role) {
      if (user.role === 'nurse' && !location.pathname.includes('/tasks')) {
        return { redirect: true, path: `/tasks?patientId=${patientIdFromUrl}`, replace: true };
      }
      
      if (user.role === 'lab_technician' || user.role === 'radiology_technician') {
        return { redirect: true, path: `/orders?patientId=${patientIdFromUrl}`, replace: true };
      }
      
      if (user.role === 'nurse_technician' && !location.pathname.includes('/vitals')) {
        return { redirect: true, path: `/vitals?patientId=${patientIdFromUrl}`, replace: true };
      }
    }
    
    // Check permissions (if specified)
    if (requiredPermission && user) {
      const permissionGranted = hasPermission(requiredPermission);
      
      if (!permissionGranted) {
        toast(
          language === 'pt'
            ? 'Acesso negado: Permissão necessária'
            : 'Access denied: Required permission missing', 
          {
            description: language === 'pt'
              ? 'Você não tem permissão para acessar esta funcionalidade.'
              : 'You do not have permission to access this functionality.',
            icon: <LockIcon className="h-5 w-5" />
          }
        );
        
        return { redirect: true, path: '/unauthorized', replace: true };
      }
    }
    
    // Check for required role (if specified)
    if (requiredRole && user) {
      const hasRole = user.role === requiredRole;
      
      if (!hasRole) {
        toast(
          language === 'pt'
            ? 'Acesso negado: Função necessária'
            : 'Access denied: Required role missing', 
          {
            description: language === 'pt'
              ? 'Esta funcionalidade é restrita a uma função específica.'
              : 'This functionality is restricted to a specific role.',
            icon: <LockIcon className="h-5 w-5" />
          }
        );
        
        return { redirect: true, path: '/unauthorized', replace: true };
      }
    }
    
    return { redirect: false };
  };
  
  useEffect(() => {
    const { redirect, path, replace, state } = shouldRedirect();
    if (redirect && path) {
      navigate(path, { replace: !!replace, state });
    }
  }, [location.pathname, user, requiredPermission, requiredRole, isAuthenticated]);
  
  // Return sector selection check for use in the main component
  return {
    isRootOrDashboard,
    patientIdFromUrl,
    isPatientPage
  };
};

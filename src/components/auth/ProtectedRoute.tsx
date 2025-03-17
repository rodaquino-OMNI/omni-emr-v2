
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSectorContext } from '@/hooks/useSectorContext';
import { 
  OfflineModeBanner, 
  LoadingState, 
  HipaaBanner,
  useOfflineMode,
  useRoutePermissions
} from './protected-route';

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredRole?: string | string[];
  patientId?: string;
  children?: React.ReactNode;
  redirectTo?: string;
  requireSector?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredPermission,
  requiredRole,
  patientId,
  children,
  redirectTo = '/login',
  requireSector = false
}) => {
  const location = useLocation();
  const auth = useAuth();
  const { user, isAuthenticated, isLoading, language } = auth || { 
    user: null, 
    isAuthenticated: false, 
    isLoading: true, 
    language: 'en' 
  };
  
  // Access sector context
  const sectorContext = useSectorContext();
  
  // Use offline mode hook for connectivity checks
  const { isOfflineMode, checkingConnectivity } = useOfflineMode(
    isAuthenticated || false, 
    language || 'en'
  );
  
  // Use route permissions hook to check permissions
  const { isRootOrDashboard, hasRequired } = useRoutePermissions({
    user,
    requiredPermission,
    requiredRole
  });
  
  // Handle loading state
  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  
  // If connectivity check is ongoing and we're not authenticated,
  // show a loading state
  if (!isAuthenticated && checkingConnectivity) {
    return <LoadingState message="Checking connectivity..." />;
  }
  
  // Allow navigation in offline mode
  if (isOfflineMode) {
    return (
      <>
        <OfflineModeBanner language={language || 'en'} />
        {children || <Outlet />}
      </>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ returnUrl: location.pathname }} replace />;
  }
  
  // Check if the route requires a sector and the user is a clinical role
  const isClinicalRole = user && ['doctor', 'nurse', 'medical_staff'].includes(user.role);
  const needsSector = requireSector && isClinicalRole && !sectorContext.selectedSector;
  
  // We no longer redirect to sector page, instead we'll show the route with a warning banner
  // The banner is displayed in the RoleDashboardContainer component
  
  // If user doesn't have required permission or role, redirect to unauthorized
  if (!hasRequired) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Display HIPAA banner for patients if applicable
  const displayHipaaBanner = user?.role === 'patient';
  
  return (
    <>
      {displayHipaaBanner && <HipaaBanner language={language || 'en'} />}
      {children || <Outlet />}
    </>
  );
};

export default ProtectedRoute;

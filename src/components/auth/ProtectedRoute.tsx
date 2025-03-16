
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
  requiredRole?: string;
  patientId?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredPermission,
  requiredRole,
  patientId,
  children
}) => {
  const location = useLocation();
  
  // Try to get auth context, handle gracefully if missing
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error in ProtectedRoute:", error);
    
    // Use offline mode hook to handle connectivity check
    const { isOfflineMode, checkingConnectivity } = useOfflineMode(false, 'en');
    
    if (checkingConnectivity) {
      return <LoadingState message="Checking connectivity..." />;
    }
    
    // If connectivity check is done and we're offline, allow navigation
    if (isOfflineMode) {
      return (
        <>
          <OfflineModeBanner language="en" />
          {children || <Outlet />}
        </>
      );
    }
    
    // If auth context fails and we're not offline, redirect to login
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  // If auth context is not available, show a loading state
  if (!auth) {
    return <LoadingState message="Loading authentication..." />;
  }
  
  const { user, isAuthenticated, isLoading, language } = auth;
  
  // Access sector context to check if user has a selected sector
  let sectorContext;
  try {
    sectorContext = useSectorContext();
  } catch (error) {
    console.error("Sector context error in ProtectedRoute:", error);
  }
  
  // Handle loading state
  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  
  // Use offline mode hook for connectivity checks
  const { isOfflineMode } = useOfflineMode(isAuthenticated, language);
  
  // Allow navigation in offline mode
  if (isOfflineMode) {
    return (
      <>
        <OfflineModeBanner language={language} />
        {children || <Outlet />}
      </>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  // Use route permissions hook to handle redirects and permission checks
  const { isRootOrDashboard, hasPermission } = useRoutePermissions(requiredPermission);
  
  // Check if the current route is the root or dashboard and user has no selected sector
  // Redirect to sector selection if so
  const needsSectorSelection = isRootOrDashboard && 
    sectorContext && 
    !sectorContext.selectedSector;
  
  if (needsSectorSelection) {
    return <Navigate to="/sectors" replace />;
  }
  
  // If required permission is specified and user doesn't have it,
  // the useRoutePermissions hook will redirect to unauthorized page
  
  // Display HIPAA banner for patients if applicable
  const displayHipaaBanner = user?.role === 'patient';
  
  return (
    <>
      {displayHipaaBanner && <HipaaBanner language={language} />}
      {children || <Outlet />}
    </>
  );
};

export default ProtectedRoute;

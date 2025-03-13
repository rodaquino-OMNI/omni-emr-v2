
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasPermission, canAccessPatientData } from '../../utils/authUtils';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredRole?: string;
  patientId?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredPermission,
  requiredRole,
  patientId
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Log access attempts for security auditing
  const logAccessAttempt = async (success: boolean, reason?: string) => {
    if (user) {
      try {
        await logAuditEvent(
          user.id,
          success ? 'access' : 'access_denied',
          'route',
          location.pathname,
          { 
            requiredPermission,
            requiredRole,
            patientId,
            reason
          }
        );
      } catch (error) {
        console.error('Failed to log access attempt:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <h1 className="text-2xl font-semibold text-primary">MedCare</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Log unauthorized access attempt
    logAccessAttempt(false, 'Not authenticated');
    
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  // Check role-based access if required
  if (requiredRole && user) {
    const hasRole = user.role === requiredRole || user.role === 'admin';
    
    if (!hasRole) {
      logAccessAttempt(false, `Missing required role: ${requiredRole}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Check permission-based access if required
  if (requiredPermission && user) {
    // Check if the user has the required permission
    const permissionGranted = hasPermission(user, requiredPermission);
    
    if (!permissionGranted) {
      logAccessAttempt(false, `Missing required permission: ${requiredPermission}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Check patient data access if patientId is specified
  if (patientId && user) {
    const canAccess = canAccessPatientData(user, patientId);
    
    if (!canAccess) {
      logAccessAttempt(false, `Not authorized to access patient: ${patientId}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Log successful access
  logAccessAttempt(true);
  
  // Session timeout warning for HIPAA compliance
  const sessionStartTime = sessionStorage.getItem('sessionStartTime');
  const sessionTimeoutMinutes = 30; // Get this from user settings in a real app
  const sessionWarningThreshold = 5; // Minutes before timeout to show warning
  
  if (!sessionStartTime) {
    sessionStorage.setItem('sessionStartTime', Date.now().toString());
  } else {
    const elapsedMinutes = (Date.now() - parseInt(sessionStartTime)) / (1000 * 60);
    
    // If session is about to timeout, show warning
    if (elapsedMinutes > (sessionTimeoutMinutes - sessionWarningThreshold) && 
        elapsedMinutes < sessionTimeoutMinutes) {
      // In a real app, show a modal/toast warning here
      console.warn('Session timeout warning');
    }
    
    // If session has timed out, reset session and redirect to login
    if (elapsedMinutes >= sessionTimeoutMinutes) {
      sessionStorage.removeItem('sessionStartTime');
      signOut();
      return <Navigate to="/login" state={{ timeout: true }} replace />;
    }
  }
  
  return (
    <>
      {user?.role === 'patient' && (
        <div className="bg-blue-50 text-blue-800 px-4 py-2 flex items-center gap-2 text-sm border-b border-blue-100">
          <Shield className="h-4 w-4" />
          <span>
            Your health data is protected under HIPAA regulations. Access to your information is encrypted and audited.
          </span>
        </div>
      )}
      <Outlet />
    </>
  );
};

// Helper function to sign out user when session times out
const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export default ProtectedRoute;

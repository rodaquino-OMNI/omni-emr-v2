
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';

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
  const { user, isAuthenticated, isLoading, hasPermission, canAccessPatientData, language } = useAuth();
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
        // Display error toast to notify admin users
        if (user.role === 'admin') {
          toast.error('Failed to log security audit event', {
            description: 'This might affect compliance reporting',
            icon: <AlertTriangle className="h-5 w-5" />
          });
        }
      }
    }
  };
  
  // Monitor session activity
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Reset session start time when navigating to a new protected route
    const currentTime = Date.now().toString();
    const existingStartTime = sessionStorage.getItem('sessionStartTime');
    
    if (!existingStartTime) {
      sessionStorage.setItem('sessionStartTime', currentTime);
    }
    
    // Update last active timestamp
    sessionStorage.setItem('lastActiveTime', currentTime);
    
  }, [isAuthenticated, location.pathname]);
  
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
      
      // Show user feedback about access denial
      toast.error(language === 'pt' 
        ? 'Acesso negado: Permissões insuficientes' 
        : 'Access denied: Insufficient permissions', {
        description: language === 'pt'
          ? `Você precisa ter a função de ${requiredRole} para acessar esta página.`
          : `You need ${requiredRole} role to access this page.`,
        icon: <AlertTriangle className="h-5 w-5" />
      });
      
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Check permission-based access if required
  if (requiredPermission && user) {
    // Check if the user has the required permission
    const permissionGranted = hasPermission(requiredPermission);
    
    if (!permissionGranted) {
      logAccessAttempt(false, `Missing required permission: ${requiredPermission}`);
      
      // Show user feedback about access denial
      toast.error(language === 'pt'
        ? 'Acesso negado: Permissão necessária'
        : 'Access denied: Required permission missing', {
        icon: <AlertTriangle className="h-5 w-5" />
      });
      
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Check patient data access if patientId is specified
  if (patientId && user) {
    const canAccess = canAccessPatientData(patientId);
    
    if (!canAccess) {
      logAccessAttempt(false, `Not authorized to access patient: ${patientId}`);
      
      // Show user feedback about access denial
      toast.error(language === 'pt'
        ? 'Acesso negado: Dados do paciente restritos'
        : 'Access denied: Patient data restricted', {
        description: language === 'pt'
          ? 'Você não está autorizado a acessar os dados deste paciente.'
          : 'You are not authorized to access this patient\'s data.',
        icon: <AlertTriangle className="h-5 w-5" />
      });
      
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Log successful access
  logAccessAttempt(true);
  
  return (
    <>
      {user?.role === 'patient' && (
        <div className="bg-blue-50 text-blue-800 px-4 py-2 flex items-center gap-2 text-sm border-b border-blue-100">
          <Shield className="h-4 w-4" />
          <span>
            {language === 'pt'
              ? 'Seus dados de saúde são protegidos sob regulamentos HIPAA. O acesso às suas informações é criptografado e auditado.'
              : 'Your health data is protected under HIPAA regulations. Access to your information is encrypted and audited.'}
          </span>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;

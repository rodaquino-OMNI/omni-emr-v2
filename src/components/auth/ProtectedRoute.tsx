
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertTriangle, Clock, LockIcon } from 'lucide-react';
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
  const location = useLocation();
  
  // Try to get auth context, handle gracefully if missing
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error in ProtectedRoute:", error);
    // If auth context fails, redirect to login
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  // If auth context is not available, show a loading state
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <h1 className="text-2xl font-semibold text-primary">MedCare</h1>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  const { user, isAuthenticated, isLoading, hasPermission, canAccessPatientData, language } = auth;
  
  // Handle loading state
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
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
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
      
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Display HIPAA banner for patients if applicable
  const displayHipaaBanner = user?.role === 'patient';
  
  return (
    <>
      {displayHipaaBanner && (
        <div className="bg-blue-50 text-blue-800 px-4 py-2 flex items-center gap-2 text-sm border-b border-blue-100">
          <Shield className="h-4 w-4" />
          <span>
            {language === 'pt'
              ? 'Seus dados de saúde são protegidos sob regulamentos HIPAA e LGPD. O acesso às suas informações é criptografado e auditado.'
              : 'Your health data is protected under HIPAA regulations. Access to your information is encrypted and audited.'}
          </span>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;

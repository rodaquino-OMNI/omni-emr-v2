
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertTriangle, Clock, LockIcon, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { checkConnectivity } from '@/utils/supabaseConnectivity';

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
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [checkingConnectivity, setCheckingConnectivity] = useState(true);
  
  // Try to get auth context, handle gracefully if missing
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error in ProtectedRoute:", error);
    // Check if we need to enable offline mode
    useEffect(() => {
      const checkConnection = async () => {
        setCheckingConnectivity(true);
        const isConnected = await checkConnectivity();
        if (!isConnected) {
          setIsOfflineMode(true);
          console.log("Enabling offline mode due to connection issues");
        }
        setCheckingConnectivity(false);
      };
      checkConnection();
    }, []);
    
    if (checkingConnectivity) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse">
            <h1 className="text-2xl font-semibold text-primary">MedCare</h1>
            <p className="text-muted-foreground">Checking connectivity...</p>
          </div>
        </div>
      );
    }
    
    // If connectivity check is done and we're offline, allow navigation
    if (isOfflineMode) {
      return (
        <>
          <div className="bg-yellow-50 text-yellow-800 px-4 py-2 flex items-center gap-2 text-sm border-b border-yellow-100">
            <WifiOff className="h-4 w-4" />
            <span>
              Offline mode: Limited functionality available. Some features may not work correctly.
            </span>
          </div>
          <Outlet />
        </>
      );
    }
    
    // If auth context fails and we're not offline, redirect to login
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
  
  // Check if we need to enable offline mode
  useEffect(() => {
    const checkConnection = async () => {
      if (!isAuthenticated) {
        const isConnected = await checkConnectivity();
        if (!isConnected) {
          setIsOfflineMode(true);
          console.log("Enabling offline mode due to connection issues");
          
          toast.warning(
            language === 'pt' ? 'Modo offline ativado' : 'Offline mode enabled',
            {
              description: language === 'pt'
                ? 'Funcionando com funcionalidades limitadas devido a problemas de conexão.'
                : 'Working with limited functionality due to connection issues.',
              duration: 5000
            }
          );
        }
      }
    };
    checkConnection();
  }, [isAuthenticated, language]);
  
  // Allow navigation in offline mode
  if (isOfflineMode) {
    return (
      <>
        <div className="bg-yellow-50 text-yellow-800 px-4 py-2 flex items-center gap-2 text-sm border-b border-yellow-100">
          <WifiOff className="h-4 w-4" />
          <span>
            {language === 'pt'
              ? 'Modo offline: Funcionalidade limitada disponível. Alguns recursos podem não funcionar corretamente.'
              : 'Offline mode: Limited functionality available. Some features may not work correctly.'}
          </span>
        </div>
        <Outlet />
      </>
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

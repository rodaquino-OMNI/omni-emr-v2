
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertTriangle, Clock, LockIcon, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { checkConnectivity } from '@/utils/supabaseConnectivity';
import { useSectorContext } from '@/hooks/useSectorContext';

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredRole?: string;
  patientId?: string;
  children?: React.ReactNode; // Add children as an optional prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredPermission,
  requiredRole,
  patientId,
  children
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
          {children || <Outlet />}
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
  
  // Access sector context to check if user has a selected sector
  let sectorContext;
  try {
    sectorContext = useSectorContext();
  } catch (error) {
    console.error("Sector context error in ProtectedRoute:", error);
  }
  
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
        {children || <Outlet />}
      </>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  
  // Check if the current route is the root or dashboard and user has no selected sector
  // Redirect to sector selection if so
  const needsSectorSelection = (location.pathname === '/' || location.pathname === '/dashboard') && 
    sectorContext && 
    !sectorContext.selectedSector;
  
  if (needsSectorSelection) {
    return <Navigate to="/sectors" replace />;
  }
  
  // Check for role-specific routing if a patient page is being accessed
  const isPatientPage = location.pathname.includes('/patients/') && location.pathname !== '/patients';
  if (isPatientPage && user?.role) {
    // Extract patient ID from the URL
    const patientIdFromUrl = location.pathname.split('/')[2];
    
    // Role-specific redirection for patient pages
    const shouldRedirect = (): { redirect: boolean; path: string } => {
      // If accessing a specific patient view
      if (patientIdFromUrl) {
        if (user.role === 'nurse' && !location.pathname.includes('/tasks')) {
          return { redirect: true, path: `/tasks?patientId=${patientIdFromUrl}` };
        }
        
        if (user.role === 'lab_technician' || user.role === 'radiology_technician') {
          return { redirect: true, path: `/orders?patientId=${patientIdFromUrl}` };
        }
        
        if (user.role === 'nurse_technician' && !location.pathname.includes('/vitals')) {
          return { redirect: true, path: `/vitals?patientId=${patientIdFromUrl}` };
        }
      }
      
      return { redirect: false, path: '' };
    };
    
    const { redirect, path } = shouldRedirect();
    if (redirect) {
      return <Navigate to={path} replace />;
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
      
      return <Navigate to="/unauthorized" replace />;
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
      {children || <Outlet />}
    </>
  );
};

export default ProtectedRoute;

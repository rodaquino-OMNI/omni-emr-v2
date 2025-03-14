
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { secureStorage } from '@/utils/secureStorage';
import { checkConnectivity } from '@/utils/supabaseConnectivity';
import LoginContainer from '@/components/auth/login/LoginContainer';

const Login = () => {
  // Try to get auth context, handle the case when it's not available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error in Login page:", error);
    auth = null;
  }
  
  const { user, isAuthenticated, isLoading, language } = auth || { 
    user: null, 
    isAuthenticated: false, 
    isLoading: false, 
    language: 'en' 
  };
  
  const { t } = useTranslation();
  const location = useLocation();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  
  // Check Supabase connectivity on page load
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const isConnected = await checkConnectivity();
        setIsSupabaseConnected(isConnected);
        
        if (!isConnected) {
          toast(
            language === 'pt' ? 'Erro de conexão' : 'Connection error',
            {
              description: language === 'pt' 
                ? 'Não foi possível conectar ao servidor. Algumas funcionalidades podem não estar disponíveis.'
                : 'Could not connect to the server. Some features may not be available.'
            }
          );
        }
      } catch (error) {
        console.error("Error checking connectivity:", error);
        setIsSupabaseConnected(false);
      }
    };
    
    checkSupabaseConnection();
  }, [language]);
  
  // Check if user was redirected due to session timeout
  useEffect(() => {
    try {
      const { state } = location;
      if (state && state.timeout) {
        toast(
          language === 'pt' ? "Sessão expirada" : "Session expired",
          {
            description: language === 'pt' 
              ? "Sua sessão expirou devido a inatividade. Por favor, faça login novamente."
              : "Your session has expired due to inactivity. Please log in again."
          }
        );
      }
      
      // Check if user was redirected from a specific page
      if (state && state.returnUrl) {
        // Store the return URL in secure storage to redirect after login
        secureStorage.setItem('returnUrl', state.returnUrl);
      }
    } catch (error) {
      console.error("Error processing location state:", error);
    }
  }, [location, language]);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Return a basic login page if auth context is not available
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 border rounded shadow">
          <h1 className="text-2xl mb-4">Login</h1>
          <p>Authentication service is not available</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LoadingOverlay isLoading={isLoading} text={language === 'pt' ? "Carregando..." : "Loading..."}>
        <LoginContainer 
          t={t} 
          language={language} 
          isSupabaseConnected={isSupabaseConnected}
          setIsSupabaseConnected={setIsSupabaseConnected}
        />
      </LoadingOverlay>
    </ErrorBoundary>
  );
};

export default Login;

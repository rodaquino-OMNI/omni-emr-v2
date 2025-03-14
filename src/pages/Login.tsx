
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { secureStorage } from '@/utils/secureStorage';
import { checkConnectivity } from '@/utils/supabaseConnectivity';

// Import our components
import LoginHeader from '@/components/auth/LoginHeader';
import LanguageToggle from '@/components/auth/LanguageToggle';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import EmailLoginForm from '@/components/auth/EmailLoginForm';
import { useLoginForm } from '@/hooks/useLoginForm';
import SupabaseConnectionStatus from '@/components/ui/SupabaseConnectionStatus';

const Login = () => {
  const { user, isAuthenticated, isLoading, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    validationErrors,
    setValidationErrors,
    handleSubmit,
    handleSocialLogin,
    forgotPassword,
    toggleForgotPassword
  } = useLoginForm();
  
  // Check Supabase connectivity on page load
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      const isConnected = await checkConnectivity();
      setIsSupabaseConnected(isConnected);
      
      if (!isConnected) {
        toast.error(
          language === 'pt' ? 'Erro de conexão' : 'Connection error',
          {
            description: language === 'pt' 
              ? 'Não foi possível conectar ao servidor. Algumas funcionalidades podem não estar disponíveis.'
              : 'Could not connect to the server. Some features may not be available.'
          }
        );
      }
    };
    
    checkSupabaseConnection();
  }, [language]);
  
  // Check if user was redirected due to session timeout
  useEffect(() => {
    const { state } = location;
    if (state && state.timeout) {
      toast.error(language === 'pt' ? "Sessão expirada" : "Session expired", {
        description: language === 'pt' 
          ? "Sua sessão expirou devido a inatividade. Por favor, faça login novamente."
          : "Your session has expired due to inactivity. Please log in again."
      });
    }
    
    // Check if user was redirected from a specific page
    if (state && state.returnUrl) {
      // Store the return URL in secure storage to redirect after login
      secureStorage.setItem('returnUrl', state.returnUrl);
    }
  }, [location, language]);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ErrorBoundary>
      <LoadingOverlay isLoading={isLoading} text={language === 'pt' ? "Carregando..." : "Loading..."}>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LoginHeader t={t} language={language} />
            
            <div className="glass-card p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <LanguageToggle language={language} setLanguage={setLanguage} />
                <SupabaseConnectionStatus 
                  showLabel={true}
                  onStatusChange={setIsSupabaseConnected}
                />
              </div>

              {!forgotPassword && (
                <>
                  <SocialLoginButtons 
                    isSubmitting={isSubmitting}
                    handleSocialLogin={handleSocialLogin}
                    isSupabaseConnected={isSupabaseConnected}
                  />

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        {language === 'pt' ? 'Ou continue com' : 'Or continue with'}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              <EmailLoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                language={language}
                t={t}
                forgotPassword={forgotPassword}
                toggleForgotPassword={toggleForgotPassword}
              />
            </div>
            
            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>
                {language === 'pt' 
                  ? 'Protegido com autenticação Supabase e criptografia de ponta a ponta' 
                  : 'Protected with Supabase authentication and end-to-end encryption'}
              </p>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </ErrorBoundary>
  );
};

export default Login;

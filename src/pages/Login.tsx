
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { secureStorage } from '@/utils/secureStorage';

// Import our components
import LoginHeader from '@/components/auth/LoginHeader';
import LanguageToggle from '@/components/auth/LanguageToggle';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import EmailLoginForm from '@/components/auth/EmailLoginForm';
import { useLoginForm } from '@/hooks/useLoginForm';

const Login = () => {
  const { user, isAuthenticated, isLoading, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    validationErrors,
    setValidationErrors,
    handleSubmit,
    handleSocialLogin
  } = useLoginForm();
  
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
              <LanguageToggle language={language} setLanguage={setLanguage} />

              <SocialLoginButtons 
                isSubmitting={isSubmitting}
                handleSocialLogin={handleSocialLogin}
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
              />
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </ErrorBoundary>
  );
};

export default Login;

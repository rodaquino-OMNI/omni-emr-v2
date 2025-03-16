
import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';

// Import hooks
import { useEmailLogin } from '@/hooks/login/useEmailLogin';
import { useLoginValidation } from '@/hooks/login/useLoginValidation';
import { useSocialLogin } from '@/hooks/login/useSocialLogin';
import { usePhoneLogin } from '@/hooks/login/usePhoneLogin';

// Import components
import LoginHeader, { LoginView } from './LoginHeader';
import EmailLoginForm from '../EmailLoginForm';
import PhoneLoginForm from '../PhoneLoginForm';
import SocialLoginButtons from '../SocialLoginButtons';

interface LoginContainerProps {
  isSupabaseConnected?: boolean;
}

const LoginContainer = ({ isSupabaseConnected = true }: LoginContainerProps) => {
  const { t, language } = useTranslation();
  const [activeView, setActiveView] = useState<LoginView>('email');
  
  // Form validation errors
  const { 
    validationErrors, 
    setValidationErrors,
    validateEmailPassword,
    validatePhone 
  } = useLoginValidation(language);
  
  // Email login
  const {
    email,
    setEmail,
    password,
    setPassword,
    forgotPassword,
    toggleForgotPassword,
    handleEmailSubmit,
    isSubmitting: isEmailSubmitting,
    pendingApproval,
    error: emailError,
    clearError: clearEmailError
  } = useEmailLogin(language);
  
  // Social login
  const {
    handleSocialLogin,
    isSubmitting: isSocialSubmitting,
    error: socialError
  } = useSocialLogin(language);
  
  // Phone login
  const {
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    isSubmitting: isPhoneSubmitting,
    verificationSent,
    usePhoneLogin: showPhoneLogin,
    togglePhoneLogin,
    resetPhoneForm,
    handlePhoneSubmit,
    handleVerifySubmit,
    error: phoneError
  } = usePhoneLogin(language);
  
  // Prepare login error message
  const loginError = emailError || phoneError || socialError;
  
  // Handle form submission for email login
  const handleEmailFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (validateEmailPassword(email, password, forgotPassword)) {
      await handleEmailSubmit(e, () => validateEmailPassword(email, password, forgotPassword));
    }
    return Promise.resolve();
  };
  
  // Handle form submission for phone login
  const handlePhoneFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (validatePhone(phone, verificationSent, verificationCode)) {
      await handlePhoneSubmit(e, () => validatePhone(phone, verificationSent, verificationCode));
    }
    return Promise.resolve();
  };
  
  // Handle form submission for phone verification
  const handleVerifyFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (validatePhone(phone, verificationSent, verificationCode)) {
      await handleVerifySubmit(e, () => validatePhone(phone, verificationSent, verificationCode));
    }
    return Promise.resolve();
  };
  
  // Reset validation errors when tab changes
  useEffect(() => {
    setValidationErrors({});
  }, [activeView, setValidationErrors]);
  
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <LoginHeader 
            t={t} 
            language={language}
            activeView={activeView}
            setActiveView={setActiveView}
          />
          
          {!isSupabaseConnected && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {language === 'pt' ? 'Problema de Conexão' : 'Connection Issue'}
              </AlertTitle>
              <AlertDescription>
                {language === 'pt' 
                  ? 'Não foi possível conectar ao servidor. Algumas funcionalidades podem estar indisponíveis.'
                  : 'Could not connect to the server. Some features may be unavailable.'}
              </AlertDescription>
            </Alert>
          )}
          
          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {language === 'pt' ? 'Erro de Autenticação' : 'Authentication Error'}
              </AlertTitle>
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}
          
          {pendingApproval && (
            <Alert className="mb-6 bg-amber-50 text-amber-900 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {language === 'pt' ? 'Aprovação Pendente' : 'Approval Pending'}
              </AlertTitle>
              <AlertDescription>
                {language === 'pt' 
                  ? 'Sua conta está aguardando aprovação. Você será notificado assim que for aprovada.'
                  : 'Your account is pending approval. You will be notified once it is approved.'}
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeView} className="w-full">
            <TabsContent value="email" className="mt-0">
              <EmailLoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleEmailFormSubmit}
                isSubmitting={isEmailSubmitting}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                language={language}
                t={t}
                forgotPassword={forgotPassword}
                toggleForgotPassword={toggleForgotPassword}
              />
            </TabsContent>
            
            <TabsContent value="phone" className="mt-0">
              <PhoneLoginForm 
                phone={phone}
                setPhone={setPhone}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                handlePhoneSubmit={handlePhoneFormSubmit}
                handleVerifySubmit={handleVerifyFormSubmit}
                handleClearError={clearEmailError}
                isSubmitting={isPhoneSubmitting}
                verificationSent={verificationSent}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                language={language}
                t={t}
                resetForm={resetPhoneForm}
              />
            </TabsContent>
            
            <TabsContent value="social" className="mt-0">
              <SocialLoginButtons 
                isSubmitting={isSocialSubmitting}
                handleSocialLogin={handleSocialLogin}
                isSupabaseConnected={isSupabaseConnected}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginContainer;

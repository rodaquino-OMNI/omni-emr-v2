
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

// Import hooks
import { useEmailLogin } from '@/hooks/login/useEmailLogin';
import { useLoginValidation } from '@/hooks/login/useLoginValidation';
import { useSocialLogin } from '@/hooks/login/useSocialLogin';
import { usePhoneLogin } from '@/hooks/login/usePhoneLogin';

// Import components
import LoginHeader from './LoginHeader';
import LoginErrorAlert from './LoginErrorAlert';
import ApprovalPendingAlert from './ApprovalPendingAlert';
import ConnectionAlert from './ConnectionAlert';
import LoginTabs from './LoginTabs';

interface LoginContainerProps {
  isSupabaseConnected?: boolean;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ isSupabaseConnected = true }) => {
  const { t, language } = useTranslation();
  const [activeView, setActiveView] = useState<'email' | 'phone' | 'social'>('email');
  
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
    clearError: clearEmailError,
    isLockedOut,
    resetLockout,
    remainingLockoutTime
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
    console.log('LoginContainer: handleEmailFormSubmit called');
    console.log('LoginContainer: Email:', email);
    console.log('LoginContainer: Password:', password ? '(password provided)' : '(no password)');
    e.preventDefault();
    if (validateEmailPassword(email, password, forgotPassword)) {
      console.log('LoginContainer: Validation passed, calling handleEmailSubmit');
      try {
        await handleEmailSubmit(e, () => validateEmailPassword(email, password, forgotPassword));
        console.log('LoginContainer: handleEmailSubmit completed');
      } catch (error) {
        console.error('LoginContainer: Error in handleEmailSubmit:', error);
      }
    } else {
      console.log('LoginContainer: Validation failed');
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
      <Card className="w-full max-w-md bg-background/5 backdrop-blur-xl border-muted">
        <CardContent className="pt-6">
          <LoginHeader 
            t={t} 
            language={language}
            activeView={activeView}
            setActiveView={setActiveView}
          />
          
          <ConnectionAlert isSupabaseConnected={isSupabaseConnected} language={language} />
          <LoginErrorAlert error={loginError} language={language} />
          <ApprovalPendingAlert pendingApproval={pendingApproval} language={language} />
          
          <LoginTabs
            activeView={activeView}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleEmailFormSubmit={handleEmailFormSubmit}
            isEmailSubmitting={isEmailSubmitting}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            language={language}
            t={t}
            forgotPassword={forgotPassword}
            toggleForgotPassword={toggleForgotPassword}
            
            phone={phone}
            setPhone={setPhone}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            handlePhoneFormSubmit={handlePhoneFormSubmit}
            handleVerifyFormSubmit={handleVerifyFormSubmit}
            clearEmailError={clearEmailError}
            isPhoneSubmitting={isPhoneSubmitting}
            verificationSent={verificationSent}
            resetPhoneForm={resetPhoneForm}
            
            handleSocialLogin={handleSocialLogin}
            isSocialSubmitting={isSocialSubmitting}
            isSupabaseConnected={isSupabaseConnected}
            
            isLockedOut={isLockedOut}
            resetLockout={resetLockout}
            remainingLockoutTime={remainingLockoutTime}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginContainer;

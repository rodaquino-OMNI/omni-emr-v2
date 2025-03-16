
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Provider } from '@supabase/supabase-js';

// Import components
import LoginHeader from './LoginHeader';
import LoginCard from './LoginCard';
import LanguageToggle from '../LanguageToggle';
import EmailLoginForm from '../EmailLoginForm';
import PhoneLoginForm from '../PhoneLoginForm';
import SocialLoginButtons from '../SocialLoginButtons';

// Supabase connection status
import SupabaseConnectionStatus from '@/components/ui/SupabaseConnectionStatus';
import TranslatedText from '@/components/common/TranslatedText';
import { useLoginForm } from '@/hooks/useLoginForm';
import { usePhoneLogin } from '@/hooks/login/usePhoneLogin';
import { useEmailLogin } from '@/hooks/login/useEmailLogin';

interface LoginContainerProps {
  isSupabaseConnected: boolean;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ isSupabaseConnected }) => {
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  
  // Get login hooks
  const { handleSocialLogin, isSubmittingSocial } = useLoginForm();
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    forgotPassword,
    toggleForgotPassword,
    handleEmailSubmit,
    isSubmitting: isSubmittingEmail,
    pendingApproval
  } = useEmailLogin(language);
  
  const {
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    isSubmitting: isSubmittingPhone,
    verificationSent,
    usePhoneLogin,
    togglePhoneLogin,
    resetPhoneForm,
    handlePhoneSubmit,
    handleVerifySubmit
  } = usePhoneLogin(language);
  
  // Login method tab state
  const [activeLoginMethod, setActiveLoginMethod] = useState<'email' | 'phone'>('email');
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    phone: '',
    code: ''
  });
  
  // Clear error helper function
  const handleClearError = (field: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };
  
  // Validate form
  const validateEmailForm = () => {
    let isValid = true;
    const errors = { ...validationErrors };
    
    if (!email) {
      errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
      isValid = false;
    }
    
    if (!forgotPassword && !password) {
      errors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  const validatePhoneForm = () => {
    let isValid = true;
    const errors = { ...validationErrors };
    
    if (!verificationSent) {
      // Validating phone number
      if (!phone) {
        errors.phone = language === 'pt' ? 'Número de telefone é obrigatório' : 'Phone number is required';
        isValid = false;
      } else if (!/^\+[1-9]\d{1,14}$/.test(phone)) {
        errors.phone = language === 'pt' 
          ? 'Formato inválido. Use o formato internacional: +1234567890' 
          : 'Invalid format. Use international format: +1234567890';
        isValid = false;
      }
    } else {
      // Validating verification code
      if (!verificationCode) {
        errors.code = language === 'pt' ? 'Código de verificação é obrigatório' : 'Verification code is required';
        isValid = false;
      } else if (!/^\d{6}$/.test(verificationCode)) {
        errors.code = language === 'pt' ? 'Código deve ter 6 dígitos' : 'Code must be 6 digits';
        isValid = false;
      }
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  // Handle login method switching
  const handleLoginMethodChange = (method: 'email' | 'phone') => {
    setActiveLoginMethod(method);
    setValidationErrors({
      email: '',
      password: '',
      phone: '',
      code: ''
    });
  };
  
  // Wrapper for email submit
  const handleEmailFormSubmit = (e: React.FormEvent) => {
    handleEmailSubmit(e, validateEmailForm);
  };
  
  // Wrapper for phone submit
  const handlePhoneFormSubmit = (e: React.FormEvent) => {
    handlePhoneSubmit(e, validatePhoneForm);
  };
  
  // Wrapper for verification submit
  const handleVerificationSubmit = (e: React.FormEvent) => {
    handleVerifySubmit(e, validatePhoneForm);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <LoginCard 
          t={t} 
          language={language} 
          isSupabaseConnected={isSupabaseConnected}
        >
          <div className="mb-8">
            <LoginHeader 
              t={t} 
              language={language} 
            />
            
            {!isSupabaseConnected && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                <TranslatedText 
                  textKey="databaseConnectionError" 
                  fallback="Database connection error. Please try again later."
                  className="text-sm text-destructive"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Login method tabs */}
            <div className="flex border-b">
              <button
                className={`py-2 px-4 ${activeLoginMethod === 'email' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                onClick={() => handleLoginMethodChange('email')}
              >
                {t('emailLogin')}
              </button>
              <button
                className={`py-2 px-4 ${activeLoginMethod === 'phone' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                onClick={() => handleLoginMethodChange('phone')}
              >
                {t('phoneLogin')}
              </button>
            </div>
            
            {/* Login forms */}
            {activeLoginMethod === 'email' ? (
              <EmailLoginForm
                email={email}
                setEmail={(value) => {
                  setEmail(value);
                  handleClearError('email');
                }}
                password={password}
                setPassword={(value) => {
                  setPassword(value);
                  handleClearError('password');
                }}
                handleSubmit={handleEmailFormSubmit}
                isSubmitting={isSubmittingEmail}
                forgotPassword={forgotPassword}
                toggleForgotPassword={toggleForgotPassword}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                language={language}
                t={t}
              />
            ) : (
              <PhoneLoginForm
                phone={phone}
                setPhone={setPhone}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                handlePhoneSubmit={handlePhoneFormSubmit}
                handleVerifySubmit={handleVerificationSubmit}
                handleClearError={() => {
                  handleClearError(verificationSent ? 'code' : 'phone');
                }}
                isSubmitting={isSubmittingPhone}
                verificationSent={verificationSent}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                language={language}
                t={t}
                resetForm={resetPhoneForm}
              />
            )}
            
            {/* Social login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-background text-muted-foreground">
                    {t('orContinueWith')}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <SocialLoginButtons
                  isSubmitting={isSubmittingEmail || isSubmittingPhone || isSubmittingSocial}
                  handleSocialLogin={handleSocialLogin} 
                  isSupabaseConnected={isSupabaseConnected}
                />
              </div>
            </div>
          </div>
          
          {/* Connection status */}
          <div className="mt-8 text-center">
            <SupabaseConnectionStatus connected={isSupabaseConnected} />
          </div>
          
          {/* Language toggle */}
          <div className="mt-4 flex justify-center">
            <LanguageToggle 
              language={language}
              setLanguage={setLanguage}
            />
          </div>
        </LoginCard>
      </div>
    </div>
  );
};

export default LoginContainer;

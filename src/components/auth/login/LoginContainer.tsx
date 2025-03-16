
import React, { useState } from 'react';
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

interface LoginContainerProps {
  isSupabaseConnected: boolean;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ isSupabaseConnected }) => {
  const { t, language, setLanguage } = useTranslation();
  const { handleSocialLogin } = useLoginForm();
  
  // Form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showPhoneVerification, setShowPhoneVerification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Login method tab state
  const [activeLoginMethod, setActiveLoginMethod] = useState<'email' | 'phone'>('email');
  
  // Handle email login
  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Implementation would go here
      console.log('Login with email:', email, password);
      return { success: true };
    } catch (err) {
      setError(t('loginFailed'));
      console.error(err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  
  // Handle send code for phone login
  const handleSendCode = async () => {
    // Implementation would go here
    console.log('Sending code to:', phone);
    setShowPhoneVerification(true);
  };
  
  // Handle social logins
  const handleGoogleLogin = async () => {
    await handleSocialLogin('google');
  };

  const handleMicrosoftLogin = async () => {
    await handleSocialLogin('azure');
  };
  
  // Map validation errors for compatibility with form components
  const validationErrors = {
    email: error && activeLoginMethod === 'email' ? error : '',
    password: '',
    phone: error && activeLoginMethod === 'phone' ? error : '',
    code: ''
  };
  
  const setValidationErrors = (errors: { [key: string]: string }) => {
    // Map validation error updates if needed
    if (errors.email || errors.password) {
      setError(errors.email || errors.password);
    } else if (errors.phone || errors.code) {
      setError(errors.phone || errors.code);
    } else {
      setError('');
    }
  };
  
  // Reset form helper
  const resetForm = () => {
    setShowPhoneVerification(false);
    setError('');
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
              activeView={activeLoginMethod} 
              setActiveView={setActiveLoginMethod}
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
                onClick={() => setActiveLoginMethod('email')}
              >
                {t('emailLogin')}
              </button>
              <button
                className={`py-2 px-4 ${activeLoginMethod === 'phone' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                onClick={() => setActiveLoginMethod('phone')}
              >
                {t('phoneLogin')}
              </button>
            </div>
            
            {/* Login forms */}
            {activeLoginMethod === 'email' ? (
              <EmailLoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleEmailLogin}
                isSubmitting={loading}
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
                handlePhoneSubmit={handleSendCode}
                handleVerifySubmit={handleEmailLogin}
                handleClearError={() => setError('')}
                isSubmitting={loading}
                verificationSent={showPhoneVerification}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                language={language}
                t={t}
                resetForm={resetForm}
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
                  isSubmitting={loading}
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

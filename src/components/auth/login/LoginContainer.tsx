
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthLogin } from '@/hooks/useAuthLogin';

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

interface LoginContainerProps {
  isSupabaseConnected: boolean;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ isSupabaseConnected }) => {
  const { t, language } = useTranslation();
  const { login, loginWithSocial } = useAuthLogin();
  
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
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || t('loginFailed'));
      }
    } catch (err) {
      setError(t('loginFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle send code for phone login
  const handleSendCode = async () => {
    // Implementation would go here
    setShowPhoneVerification(true);
  };
  
  // Social logins
  const handleGoogleLogin = () => loginWithSocial('google');
  const handleMicrosoftLogin = () => loginWithSocial('azure');
  
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
                error={error}
                isLoading={loading}
              />
            ) : (
              <PhoneLoginForm
                phone={phone}
                setPhone={setPhone}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                handleSendCode={handleSendCode}
                handleSubmit={handleEmailLogin}
                handleClearError={() => setError('')}
                error={error}
                isLoading={loading}
                showVerification={showPhoneVerification}
                setShowVerification={setShowPhoneVerification}
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
                  handleSocialLogin={handleGoogleLogin} 
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

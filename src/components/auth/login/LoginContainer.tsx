
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthLogin } from '@/hooks/useAuthLogin';

// Import components
import LoginHeader from './LoginHeader';
import LoginCard, { LoginCardProps } from './LoginCard';
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
  const authLogin = useAuthLogin();
  
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
      const result = await authLogin.login(email, password);
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
  
  // Social logins
  const handleGoogleLogin = () => authLogin.loginWithSocial('google');
  const handleMicrosoftLogin = () => authLogin.loginWithSocial('azure');
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <LoginCard>
          <div className="mb-8">
            <LoginHeader />
            
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
                t={t}
                language={language}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onLogin={handleEmailLogin}
                error={error}
              />
            ) : (
              <PhoneLoginForm
                t={t}
                language={language}
                phone={phone}
                setPhone={setPhone}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                onLogin={handleEmailLogin}
                onSendCode={() => {}}
                onClearError={() => setError('')}
                error={error}
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
                  onGoogle={handleGoogleLogin}
                  onMicrosoft={handleMicrosoftLogin}
                />
              </div>
            </div>
          </div>
          
          {/* Connection status */}
          <div className="mt-8 text-center">
            <SupabaseConnectionStatus isConnected={isSupabaseConnected} />
          </div>
          
          {/* Language toggle */}
          <div className="mt-4 flex justify-center">
            <LanguageToggle />
          </div>
        </LoginCard>
      </div>
    </div>
  );
};

export default LoginContainer;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import LoginCard from '@/components/auth/login/LoginCard';
import LoginHeader from '@/components/auth/login/LoginHeader';
import EmailLoginForm from '@/components/auth/EmailLoginForm';
import PhoneLoginForm from '@/components/auth/PhoneLoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LanguageToggle from '@/components/auth/LanguageToggle';
import { useTranslation } from '@/hooks/useTranslation';
import SupabaseConnectionStatus from '@/components/ui/SupabaseConnectionStatus';
import { checkDatabaseSchema } from '@/utils/supabaseSchemaCheck';
import { Language } from '@/types/auth';
import { useAuthLogin } from '@/hooks/useAuthLogin';

interface LoginContainerProps {
  t: (key: string, ...params: any[]) => string;
  language: Language;
  isSupabaseConnected: boolean | null;
  setIsSupabaseConnected: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const LoginContainer = ({ 
  t, 
  language,
  isSupabaseConnected,
  setIsSupabaseConnected
}: LoginContainerProps) => {
  const [activeView, setActiveView] = useState<'email' | 'phone'>('email');
  const [showSchemaWarning, setShowSchemaWarning] = useState<boolean>(false);
  
  // Authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { loginWithEmail, loginWithPhone, loginWithSocial, sendPhoneCode } = useAuthLogin();
  
  // Check database schema on mount
  useEffect(() => {
    const checkSchema = async () => {
      try {
        // Only check schema if we have a connection
        if (isSupabaseConnected) {
          const isSchemaValid = await checkDatabaseSchema();
          setShowSchemaWarning(!isSchemaValid);
        }
      } catch (error) {
        console.error('Error checking database schema:', error);
        // Don't show schema warnings on connection errors to avoid duplicate alerts
      }
    };
    
    checkSchema();
  }, [isSupabaseConnected]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginCard 
        isSupabaseConnected={isSupabaseConnected}
      >
        <LoginHeader 
          t={t} 
          language={language} 
          activeView={activeView} 
          setActiveView={setActiveView}
        />
        
        {/* Database connection status indicator */}
        <div className="mb-4 flex justify-end">
          <SupabaseConnectionStatus 
            showLabel={false} 
            onStatusChange={(status) => {
              if (setIsSupabaseConnected) setIsSupabaseConnected(status);
            }} 
          />
        </div>
        
        {/* Database schema warning if needed */}
        {showSchemaWarning && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('database.schemaIssuesTitle')}</AlertTitle>
            <AlertDescription>
              {t('database.schemaIssuesDescription')}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Connection error message */}
        {isSupabaseConnected === false && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('database.connectionErrorTitle')}</AlertTitle>
            <AlertDescription>
              {t('database.connectionErrorDescription')}
            </AlertDescription>
          </Alert>
        )}
        
        {activeView === 'email' ? (
          <EmailLoginForm 
            t={t} 
            language={language}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            error={error}
            onLogin={() => {
              setLoading(true);
              setError(null);
              loginWithEmail(email, password)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
            }}
          />
        ) : (
          <PhoneLoginForm 
            t={t} 
            language={language}
            phone={phone}
            setPhone={setPhone}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            showVerification={showVerification}
            setShowVerification={setShowVerification}
            loading={loading}
            error={error}
            onSendCode={() => {
              setLoading(true);
              setError(null);
              sendPhoneCode(phone)
                .then(() => setShowVerification(true))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
            }}
            onLogin={() => {
              setLoading(true);
              setError(null);
              loginWithPhone(phone, verificationCode)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
            }}
          />
        )}
        
        <div className="mt-6">
          <SocialLoginButtons 
            onGoogleLogin={() => loginWithSocial('google')}
            onMicrosoftLogin={() => loginWithSocial('azure')}
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary hover:underline">
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>
        
        <div className="mt-4 flex justify-center">
          <LanguageToggle language={language} setLanguage={() => {}} />
        </div>
      </LoginCard>
    </div>
  );
};

export default LoginContainer;

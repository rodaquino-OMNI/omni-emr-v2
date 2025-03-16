import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import LoginCard from './LoginCard';
import LoginHeader from './LoginHeader';
import EmailLoginForm from './EmailLoginForm';
import PhoneLoginForm from './PhoneLoginForm';
import SocialLoginButtons from './SocialLoginButtons';
import LanguageToggle from '../LanguageToggle';
import { useTranslation } from '@/hooks/useTranslation';
import SupabaseConnectionStatus from '@/components/ui/SupabaseConnectionStatus';

interface LoginContainerProps {
  t: ReturnType<typeof useTranslation>['t'];
  language: ReturnType<typeof useTranslation>['language'];
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
  
  // Check database schema on mount
  useEffect(() => {
    const checkSchema = async () => {
      try {
        // Only check schema if we have a connection
        if (isSupabaseConnected) {
          const { checkDatabaseSchema } = await import('@/utils/supabaseSchemaCheck');
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
      <LoginCard>
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
          <EmailLoginForm t={t} language={language} />
        ) : (
          <PhoneLoginForm t={t} language={language} />
        )}
        
        <div className="mt-6">
          <SocialLoginButtons t={t} language={language} />
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
          <LanguageToggle />
        </div>
      </LoginCard>
    </div>
  );
};

export default LoginContainer;

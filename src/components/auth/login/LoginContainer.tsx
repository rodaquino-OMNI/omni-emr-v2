
import React from 'react';
import { Language } from '@/types/auth';
import LoginHeader from '@/components/auth/LoginHeader';
import LanguageToggle from '@/components/auth/LanguageToggle';
import LoginCard from '@/components/auth/login/LoginCard';
import SupabaseConnectionStatus from '@/components/ui/SupabaseConnectionStatus';

interface LoginContainerProps {
  t: (key: string) => string;
  language: Language;
  isSupabaseConnected: boolean | null;
  setIsSupabaseConnected: (isConnected: boolean | null) => void;
}

const LoginContainer = ({ 
  t, 
  language, 
  isSupabaseConnected, 
  setIsSupabaseConnected 
}: LoginContainerProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader t={t} language={language} />
        
        <div className="glass-card p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <LanguageToggle language={language} setLanguage={() => {}} />
            <SupabaseConnectionStatus 
              showLabel={true}
              onStatusChange={setIsSupabaseConnected}
            />
          </div>

          <LoginCard 
            t={t} 
            language={language} 
            isSupabaseConnected={isSupabaseConnected} 
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
  );
};

export default LoginContainer;

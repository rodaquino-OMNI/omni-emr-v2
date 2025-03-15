
import React, { useState } from 'react';
import { Language } from '@/types/auth';
import LoginHeader from '@/components/auth/LoginHeader';
import LanguageToggle from '@/components/auth/LanguageToggle';
import LoginCard from '@/components/auth/login/LoginCard';
import SupabaseConnectionStatus from '@/components/ui/SupabaseConnectionStatus';
import { Shield, CheckCircle2 } from 'lucide-react';

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
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader t={t} language={language} />
        
        <div className="glass-card p-8 rounded-lg shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 transition-all">
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
          
          <div 
            className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-muted-foreground cursor-pointer"
            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-primary">
                <Shield className="h-4 w-4" />
                <span>{language === 'pt' ? 'Segurança avançada' : 'Advanced security'}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {showSecurityInfo ? '▲' : '▼'}
              </span>
            </div>
            
            {showSecurityInfo && (
              <div className="mt-3 space-y-2 text-xs animate-fade-in">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5" />
                  <span>{language === 'pt' 
                    ? 'Autenticação de múltiplos fatores' 
                    : 'Multi-factor authentication'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5" />
                  <span>{language === 'pt' 
                    ? 'Criptografia de ponta a ponta' 
                    : 'End-to-end encryption'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5" />
                  <span>{language === 'pt' 
                    ? 'Controle de acesso baseado em função' 
                    : 'Role-based access control'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
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

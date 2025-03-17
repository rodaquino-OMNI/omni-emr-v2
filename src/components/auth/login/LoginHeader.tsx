
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Languages } from '@/types/auth';

export type LoginView = 'email' | 'phone' | 'social';

interface LoginHeaderProps {
  t: (key: string, fallback?: string) => string;
  language: Languages;
  activeView?: LoginView;
  setActiveView?: (view: LoginView) => void;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ 
  t, 
  language
}) => {
  return (
    <div className="space-y-4 text-center mb-6">
      <CardTitle className="text-2xl font-bold">
        {t('loginToMedCare', language === 'pt' ? 'Entrar no OmniCare' : 'Login to OmniCare')}
      </CardTitle>
      <CardDescription className="mt-1">
        {language === 'pt' 
          ? 'Entre para acessar os recursos do sistema' 
          : 'Sign in to access system resources'}
      </CardDescription>
    </div>
  );
};

export default LoginHeader;

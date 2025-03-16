
import React from 'react';
import { Language } from '@/types/auth';

interface LoginHeaderProps {
  t: (key: string) => string;
  language: Language;
  activeView: 'email' | 'phone';
  setActiveView: React.Dispatch<React.SetStateAction<'email' | 'phone'>>;
}

const LoginHeader = ({ t, language, activeView, setActiveView }: LoginHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-center">
        {t('auth.signIn')}
      </h1>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        {language === 'pt' 
          ? 'Entre na sua conta para acessar o sistema'
          : 'Sign in to your account to access the system'}
      </p>
    </div>
  );
};

export default LoginHeader;

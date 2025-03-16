
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Language } from '@/types/auth';

interface LoginHeaderProps {
  t: (key: string) => string;
  language: Language;
  activeView?: 'email' | 'phone';
  setActiveView?: React.Dispatch<React.SetStateAction<'email' | 'phone'>>;
}

const LoginHeader = ({ t, language, activeView, setActiveView }: LoginHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-primary mb-2">{t('appName')}</h1>
      <p className="text-muted-foreground">{t('signIn')}</p>
      <Link 
        to="/" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mt-2"
      >
        <ArrowLeft className="h-3 w-3 mr-1" />
        {language === 'pt' ? 'Voltar para página inicial' : 'Back to home page'}
      </Link>
    </div>
  );
};

export default LoginHeader;

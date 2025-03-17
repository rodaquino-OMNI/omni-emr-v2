
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages } from '@/types/auth';
import { Mail, Phone, Users } from 'lucide-react';

export type LoginView = 'email' | 'phone' | 'social';

interface LoginHeaderProps {
  t: (key: string, fallback?: string) => string;
  language: Languages;
  activeView: LoginView;
  setActiveView: (view: LoginView) => void;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ 
  t, 
  language,
  activeView,
  setActiveView
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <CardTitle className="text-2xl font-bold">
          {t('loginToMedCare', language === 'pt' ? 'Entrar no OmniCare' : 'Login to OmniCare')}
        </CardTitle>
        <CardDescription className="mt-1">
          {language === 'pt' 
            ? 'Entre para acessar os recursos do sistema' 
            : 'Sign in to access system resources'}
        </CardDescription>
      </div>
      
      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as LoginView)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('email', 'Email')}</span>
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('phone', 'Phone')}</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('socialLogin', 'Social')}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default LoginHeader;


import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language } from '@/types/auth';

export type LoginView = 'email' | 'phone' | 'social';

export interface LoginHeaderProps {
  activeView?: LoginView;
  setActiveView?: (view: LoginView) => void;
  t: (key: string) => string;
  language: Language;
}

const LoginHeader = ({
  activeView = 'email',
  setActiveView,
  t,
  language
}: LoginHeaderProps) => {
  return (
    <div className="text-center space-y-2 mb-6">
      <h1 className="text-2xl font-bold">
        {t('signIn')}
      </h1>
      <p className="text-sm text-muted-foreground">
        {language === 'pt'
          ? 'Acesse sua conta para continuar'
          : 'Sign in to your account to continue'}
      </p>
      
      {setActiveView && (
        <Tabs 
          defaultValue={activeView} 
          value={activeView}
          className="w-full mt-4" 
          onValueChange={(value) => setActiveView(value as LoginView)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">
              {language === 'pt' ? 'Email' : 'Email'}
            </TabsTrigger>
            <TabsTrigger value="phone">
              {language === 'pt' ? 'Telefone' : 'Phone'}
            </TabsTrigger>
            <TabsTrigger value="social">
              {language === 'pt' ? 'Social' : 'Social'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};

export default LoginHeader;


import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginHeader from '@/components/auth/LoginHeader';

const Register = () => {
  const { t, language } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col justify-center bg-background">
      <LoginHeader t={t} language={language} />
      
      <div className="container max-w-lg px-4 py-8 mx-auto">
        <Card className="w-full shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {language === 'pt' ? 'Criar conta' : 'Create an account'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' 
                ? 'Preencha os dados abaixo para criar sua conta'
                : 'Enter your information below to create your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm language={language} t={t} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;

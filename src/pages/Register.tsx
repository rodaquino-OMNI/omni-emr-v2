
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Register = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('register')}</h1>
          <p className="mt-2 text-muted-foreground">{t('createAccount')}</p>
        </div>

        <div className="space-y-6">
          <p>Registration form will be implemented here.</p>
          <div className="flex justify-center">
            <a href="/login" className="text-primary hover:underline">
              {t('alreadyHaveAccount')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

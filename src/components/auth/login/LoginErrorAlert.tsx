
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Languages } from '@/types/auth';

interface LoginErrorAlertProps {
  error: string | null;
  language: Languages;
}

const LoginErrorAlert = ({ error, language }: LoginErrorAlertProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {language === 'pt' ? 'Erro de Autenticação' : 'Authentication Error'}
      </AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default LoginErrorAlert;

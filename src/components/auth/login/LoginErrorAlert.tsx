
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Languages } from '@/types/auth';

interface LoginErrorAlertProps {
  error: string | null;
  language: Languages;
}

const LoginErrorAlert: React.FC<LoginErrorAlertProps> = ({ error, language }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertTitle>
        {language === 'pt' ? 'Erro de autenticação' : 'Authentication Error'}
      </AlertTitle>
      <p className="text-sm mt-1">{error}</p>
    </Alert>
  );
};

export default LoginErrorAlert;

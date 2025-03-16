
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Language } from '@/types/auth';

interface ConnectionAlertProps {
  isSupabaseConnected: boolean;
  language: Language;
}

const ConnectionAlert = ({ isSupabaseConnected, language }: ConnectionAlertProps) => {
  if (isSupabaseConnected) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {language === 'pt' ? 'Problema de Conexão' : 'Connection Issue'}
      </AlertTitle>
      <AlertDescription>
        {language === 'pt' 
          ? 'Não foi possível conectar ao servidor. Algumas funcionalidades podem estar indisponíveis.'
          : 'Could not connect to the server. Some features may be unavailable.'}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionAlert;


import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Languages } from '@/types/auth';

interface ConnectionAlertProps {
  isSupabaseConnected: boolean;
  language: Languages;
}

const ConnectionAlert: React.FC<ConnectionAlertProps> = ({ isSupabaseConnected, language }) => {
  if (isSupabaseConnected) return null;
  
  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertTitle>
        {language === 'pt' ? 'Problema de Conexão' : 'Connection Issue'}
      </AlertTitle>
      <p className="text-sm mt-1">
        {language === 'pt' 
          ? 'Não foi possível conectar ao servidor. Alguns métodos de login podem não funcionar corretamente.'
          : 'Could not connect to the server. Some login methods may not work properly.'}
      </p>
    </Alert>
  );
};

export default ConnectionAlert;

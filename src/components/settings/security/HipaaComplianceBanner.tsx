
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const HipaaComplianceBanner = () => {
  const { language } = useTranslation();
  
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
      <ShieldAlert className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-300">
        {language === 'pt' ? 'Conformidade HIPAA' : 'HIPAA Compliance'}
      </AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-400">
        {language === 'pt' 
          ? 'Todas as informações médicas são protegidas pelas nossas políticas de segurança e por protocolos em conformidade com a HIPAA.'
          : 'All medical information is protected by our security policies and HIPAA-compliant protocols.'}
      </AlertDescription>
    </Alert>
  );
};

export default HipaaComplianceBanner;

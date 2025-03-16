
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileCheck, Lock, UserCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const ComplianceInformation = () => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            {language === 'pt' ? 'Informações de Conformidade' : 'Compliance Information'}
          </CardTitle>
          <CardDescription>
            {language === 'pt' 
              ? 'Detalhes sobre nossas políticas de conformidade e segurança' 
              : 'Details about our compliance and security policies'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">{language === 'pt' ? 'Conformidade HIPAA' : 'HIPAA Compliance'}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'pt' 
                    ? 'Nosso sistema segue rigorosamente as diretrizes da Lei de Portabilidade e Responsabilidade de Seguros de Saúde (HIPAA) para proteger informações médicas sensíveis.'
                    : 'Our system strictly follows the Health Insurance Portability and Accountability Act (HIPAA) guidelines to protect sensitive medical information.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">{language === 'pt' ? 'Criptografia de Dados' : 'Data Encryption'}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'pt' 
                    ? 'Todos os dados são criptografados em repouso e em trânsito usando AES-256 e protocolos TLS 1.3 para garantir que informações sensíveis permaneçam seguras.'
                    : 'All data is encrypted at rest and in transit using AES-256 and TLS 1.3 protocols to ensure sensitive information remains secure.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">{language === 'pt' ? 'Auditoria de Acesso' : 'Access Auditing'}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'pt' 
                    ? 'Mantemos registros detalhados de cada acesso a informações protegidas de saúde para conformidade e para detectar acesso não autorizado.'
                    : 'We maintain detailed logs of every access to protected health information for compliance and to detect unauthorized access.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceInformation;

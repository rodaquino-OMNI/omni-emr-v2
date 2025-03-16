
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, Lock, Key, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import SecurityControlItem from './SecurityControlItem';
import SessionTimeoutControl from './SessionTimeoutControl';
import MFASetup from './MFASetup';
import PasswordUpdateForm from './PasswordUpdateForm';
import { toast } from 'sonner';

// Extend User type to include mfaEnabled
declare module '@/context/AuthContext' {
  interface User {
    mfaEnabled?: boolean;
  }
}

const SecurityControls = () => {
  const { language } = useTranslation();
  const { user } = useAuth();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  
  const handleSecurityAudit = () => {
    toast.info(language === 'pt' ? 'Auditoria de segurança iniciada' : 'Security audit initiated');
    
    // Simulate audit process
    setTimeout(() => {
      toast.success(language === 'pt' ? 
        'Auditoria concluída. Nenhuma vulnerabilidade encontrada.' : 
        'Audit completed. No vulnerabilities found.');
    }, 2000);
  };
  
  const handleDownloadSecurityLog = () => {
    // In a real app, this would generate and download a security log file
    toast.success(language === 'pt' ? 
      'Registro de segurança baixado' : 
      'Security log downloaded');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <SecurityControlItem
              icon={<Shield className="h-5 w-5" />}
              title={language === 'pt' ? 'Autenticação de Dois Fatores' : 'Two-Factor Authentication'}
              description={language === 'pt' ? 
                'Adicione uma camada extra de segurança à sua conta' : 
                'Add an extra layer of security to your account'}
              enabled={user?.mfaEnabled}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMFASetup(true)}
                >
                  {user?.mfaEnabled 
                    ? (language === 'pt' ? 'Gerenciar' : 'Manage') 
                    : (language === 'pt' ? 'Configurar' : 'Set Up')}
                </Button>
              }
            />
            
            <SecurityControlItem
              icon={<Lock className="h-5 w-5" />}
              title={language === 'pt' ? 'Senha' : 'Password'}
              description={language === 'pt' ? 
                'Atualize sua senha regularmente para maior segurança' : 
                'Update your password regularly for better security'}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordUpdate(true)}
                >
                  {language === 'pt' ? 'Atualizar' : 'Update'}
                </Button>
              }
            />
            
            <SessionTimeoutControl 
              sessionTimeout={sessionTimeout}
              setSessionTimeout={setSessionTimeout}
            />
            
            <SecurityControlItem
              icon={<ShieldAlert className="h-5 w-5" />}
              title={language === 'pt' ? 'Auditoria de Segurança' : 'Security Audit'}
              description={language === 'pt' ? 
                'Verifique sua conta em busca de vulnerabilidades de segurança' : 
                'Check your account for security vulnerabilities'}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSecurityAudit}
                >
                  {language === 'pt' ? 'Executar Auditoria' : 'Run Audit'}
                </Button>
              }
            />
            
            <SecurityControlItem
              icon={<Key className="h-5 w-5" />}
              title={language === 'pt' ? 'Registro de Segurança' : 'Security Log'}
              description={language === 'pt' ? 
                'Baixe um registro de atividades de segurança recentes' : 
                'Download a log of recent security activities'}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadSecurityLog}
                >
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
      
      {showMFASetup && (
        <MFASetup 
          onClose={() => setShowMFASetup(false)} 
        />
      )}
      
      {showPasswordUpdate && (
        <PasswordUpdateForm 
          onClose={() => setShowPasswordUpdate(false)} 
        />
      )}
    </div>
  );
};

export default SecurityControls;

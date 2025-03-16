
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, AlertTriangle, SmartphoneNfc } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import SessionTimeoutControl from './SessionTimeoutControl';
import SecurityControlItem from './SecurityControlItem';

interface SecurityControlsProps {
  onShowPasswordUpdate: () => void;
  onShowMFASetup: () => void;
}

const SecurityControls: React.FC<SecurityControlsProps> = ({ 
  onShowPasswordUpdate,
  onShowMFASetup
}) => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  
  // Default session timeout values
  const [sessionTimeout, setSessionTimeout] = React.useState(30); // 30 minutes default
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            {language === 'pt' ? 'Segurança da Conta' : 'Account Security'}
          </CardTitle>
          <CardDescription>
            {language === 'pt' ? 'Gerencie as configurações de segurança da sua conta' : 'Manage your account security settings'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SecurityControlItem
            icon={Lock}
            title={language === 'pt' ? 'Senha' : 'Password'}
            description={language === 'pt' ? 'Atualize sua senha' : 'Update your password'}
            action={
              <Button variant="outline" onClick={onShowPasswordUpdate}>
                {language === 'pt' ? 'Atualizar' : 'Update'}
              </Button>
            }
          />
          
          <SecurityControlItem
            icon={SmartphoneNfc}
            title={language === 'pt' ? 'Autenticação de Dois Fatores' : 'Two-Factor Authentication'}
            description={language === 'pt' ? 'Adicione uma camada extra de segurança' : 'Add an extra layer of security'}
            action={
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.mfaEnabled ? (language === 'pt' ? 'Ativado' : 'Enabled') : (language === 'pt' ? 'Desativado' : 'Disabled')}
                </span>
                <Switch 
                  checked={user?.mfaEnabled || false}
                  onCheckedChange={() => onShowMFASetup()}
                />
              </div>
            }
          />
          
          <SessionTimeoutControl 
            sessionTimeout={sessionTimeout}
            setSessionTimeout={setSessionTimeout}
          />
          
          <SecurityControlItem
            icon={AlertTriangle}
            title={language === 'pt' ? 'Alertas de Atividade Suspeita' : 'Suspicious Activity Alerts'}
            description={language === 'pt' ? 'Receba alertas sobre atividades suspeitas' : 'Receive alerts about suspicious activity'}
            action={
              <Switch defaultChecked />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityControls;

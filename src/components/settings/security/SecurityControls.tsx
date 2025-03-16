
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
  const { t } = useTranslation();
  
  // Default session timeout values
  const [sessionTimeout, setSessionTimeout] = React.useState(30); // 30 minutes default
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            {t('accountSecurity')}
          </CardTitle>
          <CardDescription>
            {t('manageAccountSecuritySettings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SecurityControlItem
            icon={Lock}
            title={t('password')}
            description={t('updateYourPassword')}
            action={
              <Button variant="outline" onClick={onShowPasswordUpdate}>
                {t('update')}
              </Button>
            }
          />
          
          <SecurityControlItem
            icon={SmartphoneNfc}
            title={t('twoFactorAuthentication')}
            description={t('addExtraLayerSecurity')}
            action={
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.mfaEnabled ? t('enabled') : t('disabled')}
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
            title={t('suspiciousActivityAlerts')}
            description={t('receiveAlertsAboutSuspiciousActivity')}
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

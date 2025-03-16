
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const { language } = useTranslation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      toast.success(language === 'pt' ? 'Configurações de notificação salvas' : 'Notification settings saved');
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'pt' ? 'Configurações de Notificação' : 'Notification Settings'}</CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Gerencie como você recebe as notificações' 
            : 'Manage how you receive notifications'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">{language === 'pt' ? 'Notificações por Email' : 'Email Notifications'}</Label>
              <p className="text-sm text-muted-foreground">
                {language === 'pt' ? 'Receber notificações por email' : 'Receive notifications via email'}
              </p>
            </div>
            <Switch 
              id="email-notifications"
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">{language === 'pt' ? 'Notificações por SMS' : 'SMS Notifications'}</Label>
              <p className="text-sm text-muted-foreground">
                {language === 'pt' ? 'Receber notificações por SMS' : 'Receive notifications via SMS'}
              </p>
            </div>
            <Switch 
              id="sms-notifications"
              checked={smsNotifications} 
              onCheckedChange={setSmsNotifications} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-notifications">{language === 'pt' ? 'Notificações no Aplicativo' : 'In-App Notifications'}</Label>
              <p className="text-sm text-muted-foreground">
                {language === 'pt' ? 'Receber notificações dentro do aplicativo' : 'Receive in-app notifications'}
              </p>
            </div>
            <Switch 
              id="app-notifications"
              checked={appNotifications} 
              onCheckedChange={setAppNotifications} 
            />
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-md font-medium mb-3">
              {language === 'pt' ? 'Tipos de Notificação' : 'Notification Types'}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="critical-alerts">{language === 'pt' ? 'Alertas Críticos' : 'Critical Alerts'}</Label>
              <p className="text-sm text-muted-foreground">
                {language === 'pt' ? 'Alertas para resultados críticos e emergências' : 'Critical results and emergency alerts'}
              </p>
            </div>
            <Switch 
              id="critical-alerts"
              checked={criticalAlerts} 
              onCheckedChange={setCriticalAlerts} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-reminders">{language === 'pt' ? 'Lembretes de Consulta' : 'Appointment Reminders'}</Label>
              <p className="text-sm text-muted-foreground">
                {language === 'pt' ? 'Lembretes para consultas agendadas' : 'Reminders for scheduled appointments'}
              </p>
            </div>
            <Switch 
              id="appointment-reminders"
              checked={appointmentReminders} 
              onCheckedChange={setAppointmentReminders} 
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving 
              ? (language === 'pt' ? 'Salvando...' : 'Saving...') 
              : (language === 'pt' ? 'Salvar Configurações' : 'Save Settings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;

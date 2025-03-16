
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

const SystemSettings = () => {
  const { language } = useTranslation();
  const [aiAssist, setAiAssist] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      toast.success(language === 'pt' ? 'Configurações salvas com sucesso' : 'Settings saved successfully');
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'pt' ? 'Configurações do Sistema' : 'System Settings'}</CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Gerencie as configurações globais da aplicação' 
            : 'Manage global application settings'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium text-base">
              {language === 'pt' ? 'Assistente de IA' : 'AI Assistant'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'pt' 
                ? 'Ativar sugestões e assistência com IA' 
                : 'Enable AI suggestions and assistance'}
            </p>
          </div>
          <Switch 
            checked={aiAssist} 
            onCheckedChange={setAiAssist} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium text-base">
              {language === 'pt' ? 'Salvamento Automático' : 'Auto Save'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'pt' 
                ? 'Salvar documentos automaticamente enquanto você trabalha' 
                : 'Save documents automatically as you work'}
            </p>
          </div>
          <Switch 
            checked={autoSave} 
            onCheckedChange={setAutoSave} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium text-base">
              {language === 'pt' ? 'Modo Escuro' : 'Dark Mode'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'pt' 
                ? 'Usar tema escuro em toda a aplicação' 
                : 'Use dark theme throughout the application'}
            </p>
          </div>
          <Switch 
            checked={darkMode} 
            onCheckedChange={setDarkMode} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium text-base">
              {language === 'pt' ? 'Notificações' : 'Notifications'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'pt' 
                ? 'Receber notificações do sistema' 
                : 'Receive system notifications'}
            </p>
          </div>
          <Switch 
            checked={notifications} 
            onCheckedChange={setNotifications} 
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving 
            ? (language === 'pt' ? 'Salvando...' : 'Saving...') 
            : (language === 'pt' ? 'Salvar Configurações' : 'Save Settings')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemSettings;


import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Save } from 'lucide-react';

const SystemSettings = () => {
  const { language, setLanguage } = useAuth();
  const { t } = useTranslation();
  
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24hour');
  const [theme, setTheme] = useState('light');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle system settings update logic
    toast.success(language === 'pt' ? "Configurações do sistema atualizadas" : "System settings updated", { description: language === 'pt' ? "Suas preferências foram salvas com sucesso." : "Your preferences have been saved successfully." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">{language === 'pt' ? 'Configurações do Sistema' : 'System Settings'}</h2>
        <p className="text-muted-foreground mb-6">
          {language === 'pt' ? 'Personalize suas configurações e preferências do sistema.' : 'Customize your system settings and preferences.'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium">
                {language === 'pt' ? 'Idioma' : 'Language'}
              </label>
              <select
                id="language"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'pt')}
              >
                <option value="pt">{language === 'pt' ? 'Português' : 'Portuguese'}</option>
                <option value="en">{language === 'pt' ? 'Inglês' : 'English'}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="timezone" className="text-sm font-medium">
                {language === 'pt' ? 'Fuso Horário' : 'Timezone'}
              </label>
              <select
                id="timezone"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="America/Sao_Paulo">Horário de Brasília (BRT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dateFormat" className="text-sm font-medium">
                {language === 'pt' ? 'Formato de Data' : 'Date Format'}
              </label>
              <select
                id="dateFormat"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="timeFormat" className="text-sm font-medium">
                {language === 'pt' ? 'Formato de Hora' : 'Time Format'}
              </label>
              <select
                id="timeFormat"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
              >
                <option value="24hour">{language === 'pt' ? '24 horas' : '24-hour'}</option>
                <option value="12hour">{language === 'pt' ? '12 horas (AM/PM)' : '12-hour (AM/PM)'}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="theme" className="text-sm font-medium">
                {language === 'pt' ? 'Tema' : 'Theme'}
              </label>
              <select
                id="theme"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">{language === 'pt' ? 'Claro' : 'Light'}</option>
                <option value="dark">{language === 'pt' ? 'Escuro' : 'Dark'}</option>
                <option value="system">{language === 'pt' ? 'Padrão do Sistema' : 'System Default'}</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-2"
              >
                <Save className="h-4 w-4" />
                {language === 'pt' ? 'Salvar Configurações' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;

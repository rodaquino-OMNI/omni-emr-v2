
import React from 'react';
;
;
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from '../components/settings/ProfileSettings';
import SystemSettings from '../components/settings/SystemSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import { useTranslation } from '../hooks/useTranslation';

const SettingsPage = () => {
  const { language } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-6">{language === 'pt' ? 'Configurações' : 'Settings'}</h1>
            
            <div className="glass-card p-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="profile">{language === 'pt' ? 'Perfil' : 'Profile'}</TabsTrigger>
                  <TabsTrigger value="system">{language === 'pt' ? 'Sistema' : 'System'}</TabsTrigger>
                  <TabsTrigger value="security">{language === 'pt' ? 'Segurança' : 'Security'}</TabsTrigger>
                  <TabsTrigger value="notifications">{language === 'pt' ? 'Notificações' : 'Notifications'}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <ProfileSettings />
                </TabsContent>
                
                <TabsContent value="system">
                  <SystemSettings />
                </TabsContent>
                
                <TabsContent value="security">
                  <SecuritySettings />
                </TabsContent>
                
                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
  );
};

export default SettingsPage;

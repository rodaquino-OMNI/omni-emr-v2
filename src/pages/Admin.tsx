
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingApprovalList from '@/components/auth/PendingApprovalList';

const Admin = () => {
  const { t, language } = useTranslation();
  const { user, hasPermission } = useAuth();
  
  // Check if user has admin rights
  if (!user || !hasPermission('manage_users')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'pt' ? 'Administração' : 'Administration'}
      </h1>
      
      <Tabs defaultValue="user-approval" className="space-y-4">
        <TabsList>
          <TabsTrigger value="user-approval">
            {language === 'pt' ? 'Aprovação de Usuários' : 'User Approval'}
          </TabsTrigger>
          <TabsTrigger value="system-settings">
            {language === 'pt' ? 'Configurações do Sistema' : 'System Settings'}
          </TabsTrigger>
          <TabsTrigger value="audit-logs">
            {language === 'pt' ? 'Logs de Auditoria' : 'Audit Logs'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-approval" className="space-y-4">
          <PendingApprovalList />
        </TabsContent>
        
        <TabsContent value="system-settings">
          <div className="rounded-md border p-6">
            <p className="text-muted-foreground">
              {language === 'pt' 
                ? 'Configurações do sistema serão implementadas aqui.' 
                : 'System settings will be implemented here.'}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="audit-logs">
          <div className="rounded-md border p-6">
            <p className="text-muted-foreground">
              {language === 'pt' 
                ? 'Logs de auditoria serão implementados aqui.' 
                : 'Audit logs will be implemented here.'}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

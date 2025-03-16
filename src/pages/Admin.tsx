
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingApprovalList from '@/components/auth/PendingApprovalList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldCheck, Settings2, ClipboardList, UserPlus, Package } from 'lucide-react';
import FunctionBlocksManager from '@/components/admin/FunctionBlocksManager';
import RolePermissionMatrix from '@/components/admin/RolePermissionMatrix';
import RolesList from '@/components/admin/RolesList';

const Admin = () => {
  const { t, language } = useTranslation();
  const { user, hasPermission } = useAuth();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'user-approval');
  
  // Check if user has admin rights
  if (!user || !hasPermission('manage_users')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'pt' ? 'Administração' : 'Administration'}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="user-approval">
            <UserPlus className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Aprovação de Usuários' : 'User Approval'}
          </TabsTrigger>
          <TabsTrigger value="role-management">
            <ShieldCheck className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Gestão de Funções' : 'Role Management'}
          </TabsTrigger>
          <TabsTrigger value="function-blocks">
            <Package className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Blocos de Funções' : 'Function Blocks'}
          </TabsTrigger>
          <TabsTrigger value="system-settings">
            <Settings2 className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Configurações do Sistema' : 'System Settings'}
          </TabsTrigger>
          <TabsTrigger value="audit-logs">
            <ClipboardList className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Logs de Auditoria' : 'Audit Logs'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-approval" className="space-y-4">
          <PendingApprovalList />
        </TabsContent>
        
        <TabsContent value="role-management" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'pt' ? 'Papéis do Sistema' : 'System Roles'}</CardTitle>
                  <CardDescription>
                    {language === 'pt' 
                      ? 'Gerencie os papéis dos usuários no sistema' 
                      : 'Manage user roles in the system'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RolesList />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'pt' ? 'Permissões por Papel' : 'Role Permissions'}</CardTitle>
                  <CardDescription>
                    {language === 'pt' 
                      ? 'Atribua permissões a cada papel de usuário' 
                      : 'Assign permissions to each user role'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RolePermissionMatrix />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/admin/roles">
                {language === 'pt' ? 'Gestão de Funções Avançada' : 'Advanced Role Management'}
              </Link>
            </Button>
            <Button>
              {language === 'pt' ? 'Salvar Alterações' : 'Save Changes'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="function-blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'pt' ? 'Blocos de Funções' : 'Function Blocks'}</CardTitle>
              <CardDescription>
                {language === 'pt' 
                  ? 'Configure blocos de funções que podem ser atribuídos a papéis de usuário' 
                  : 'Configure function blocks that can be assigned to user roles'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FunctionBlocksManager />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button variant="outline" asChild className="mr-2">
              <Link to="/admin/function-blocks">
                {language === 'pt' ? 'Gestão Avançada de Blocos' : 'Advanced Block Management'}
              </Link>
            </Button>
          </div>
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

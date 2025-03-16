
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { RolesList } from '@/components/admin/RolesList';
import { RolePermissionMatrix } from '@/components/admin/RolePermissionMatrix';
import { FunctionBlocksManager } from '@/components/admin/FunctionBlocksManager';
import { PendingApprovalList } from '@/components/auth/PendingApprovalList';

const AdminPage: React.FC = () => {
  const { language } = useTranslation();
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);
  
  const canManageUsers = hasPermission('manage_users');
  const canManageRoles = hasPermission('manage_roles');
  const canManageFunctionBlocks = hasPermission('manage_function_blocks');
  
  if (!canManageUsers && !canManageRoles) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'pt' ? 'Acesso Negado' : 'Access Denied'}</CardTitle>
            <CardDescription>
              {language === 'pt' 
                ? 'Você não tem permissão para acessar o painel administrativo.'
                : 'You do not have permission to access the admin panel.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {language === 'pt' ? 'Painel Administrativo' : 'Admin Panel'}
      </h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          {canManageUsers && (
            <TabsTrigger value="users">
              {language === 'pt' ? 'Usuários' : 'Users'}
            </TabsTrigger>
          )}
          {canManageRoles && (
            <TabsTrigger value="roles">
              {language === 'pt' ? 'Funções' : 'Roles'}
            </TabsTrigger>
          )}
          {canManageFunctionBlocks && (
            <TabsTrigger value="function-blocks">
              {language === 'pt' ? 'Blocos Funcionais' : 'Function Blocks'}
            </TabsTrigger>
          )}
        </TabsList>
        
        {canManageUsers && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'pt' ? 'Aprovação de Usuários' : 'User Approval'}
                </CardTitle>
                <CardDescription>
                  {language === 'pt' 
                    ? 'Gerencie solicitações de acesso de novos usuários.'
                    : 'Manage access requests from new users.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PendingApprovalList />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {canManageRoles && (
          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'pt' ? 'Gerenciamento de Funções' : 'Role Management'}
                </CardTitle>
                <CardDescription>
                  {language === 'pt' 
                    ? 'Configure funções e permissões do sistema.'
                    : 'Configure system roles and permissions.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RolesList />
                <div className="mt-8">
                  <RolePermissionMatrix />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {canManageFunctionBlocks && (
          <TabsContent value="function-blocks">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'pt' ? 'Blocos Funcionais' : 'Function Blocks'}
                </CardTitle>
                <CardDescription>
                  {language === 'pt' 
                    ? 'Gerencie blocos funcionais e atribuições a funções.'
                    : 'Manage function blocks and assignments to roles.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FunctionBlocksManager />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminPage;

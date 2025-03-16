
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import RolePermissionMatrix from '@/components/admin/RolePermissionMatrix';
import RolesList from '@/components/admin/RolesList';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';

const RoleManagement = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('roles');

  // Check if user has permission to access this page
  useEffect(() => {
    if (!user || !hasPermission('manage_roles')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the role management page",
        variant: "destructive"
      });
      navigate('/unauthorized', { 
        state: { requiredPermission: 'manage_roles' } 
      });
    }
  }, [user, hasPermission, navigate, toast]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Role Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Role Configuration</CardTitle>
          <CardDescription>
            Manage roles and assign function access to different user groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Function Assignment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles" className="space-y-4">
              <RolesList />
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4">
              <RolePermissionMatrix />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;

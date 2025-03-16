
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import RoleDashboardContainer from './RoleDashboardContainer';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { UserRole } from '@/types/auth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);
  
  // Check if user has permission to access dashboard
  if (!hasPermission('dashboard:view')) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">
          You do not have permission to access the dashboard.
        </p>
      </div>
    );
  }
  
  return <RoleDashboardContainer />;
};

export default Dashboard;

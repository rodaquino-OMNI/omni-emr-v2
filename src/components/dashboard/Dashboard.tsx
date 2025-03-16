
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import RoleDashboard from './RoleDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getRoleDashboard } = usePermissions(user);
  
  return <RoleDashboard />;
};

export default Dashboard;

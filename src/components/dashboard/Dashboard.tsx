
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import RoleDashboardContainer from './RoleDashboardContainer';

const Dashboard: React.FC = () => {
  return <RoleDashboardContainer />;
};

export default Dashboard;

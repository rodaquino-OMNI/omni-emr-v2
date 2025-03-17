
import React from 'react';
import RoleDashboardContainer from '@/components/dashboard/RoleDashboardContainer';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useSectorContext } from '@/hooks/useSectorContext';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { selectedSector } = useSectorContext();
  
  // Use the role-based dashboard container which will handle permission checks
  // and display the appropriate dashboard based on user role and selected sector
  return <RoleDashboardContainer />;
};

export default Dashboard;

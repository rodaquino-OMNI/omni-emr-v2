
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import RoleDashboard from './RoleDashboard';
import { refreshAllMaterializedViews } from '@/utils/supabasePerformanceMonitor';
import { verifyRequiredTables } from '@/utils/supabaseTableCheck';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getRoleDashboard } = usePermissions(user);
  
  useEffect(() => {
    // Refresh materialized views when dashboard loads to ensure fresh data
    refreshAllMaterializedViews();
    
    // Verify required tables exist
    verifyRequiredTables();
  }, []);
  
  return <RoleDashboard />;
};

export default Dashboard;

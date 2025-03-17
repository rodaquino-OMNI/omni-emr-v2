
import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { DefaultDashboard } from '@/registry/entrypoints';

/**
 * Hook that returns the appropriate dashboard component based on user role
 */
export const useRoleBasedDashboard = () => {
  const { user } = useAuth();
  
  const DashboardComponent = useMemo(() => {
    // If user is not authenticated or has no role, default dashboard
    if (!user || !user.role) {
      return DefaultDashboard;
    }
    
    // Get component from registry based on role
    const roleSpecificDashboard = componentRegistry.getComponent(
      'dashboard', 
      user.role as UserRole
    );
    
    return roleSpecificDashboard || DefaultDashboard;
  }, [user]);
  
  return {
    DashboardComponent,
    userRole: user?.role || 'guest'
  };
};

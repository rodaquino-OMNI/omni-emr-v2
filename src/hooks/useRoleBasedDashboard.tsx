
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { UserRole } from '@/types/auth';
import { 
  DoctorDashboard,
  NurseDashboard, 
  AdminDashboard, 
  PharmacistDashboard, 
  DefaultDashboard 
} from '@/registry/entrypoints';

/**
 * Hook to determine which dashboard component to display based on user role
 * Returns the appropriate dashboard component based on user role and permissions
 */
export const useRoleBasedDashboard = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Get the dashboard component based on user role
  const DashboardComponent = React.useMemo(() => {
    if (!user?.role) {
      // Default dashboard for users without a role
      return DefaultDashboard;
    }
    
    // Try to get a role-specific dashboard from the registry
    const registeredDashboard = componentRegistry.getComponent(
      'dashboard', 
      user.role as UserRole
    );
    
    if (registeredDashboard) {
      return registeredDashboard;
    }
    
    // Manual role mapping as a fallback
    switch (user.role) {
      case 'doctor':
      case 'physician':
        return DoctorDashboard;
      case 'nurse':
        return NurseDashboard;
      case 'admin':
      case 'system_administrator':
        return AdminDashboard;
      case 'pharmacist':
        return PharmacistDashboard;
      default:
        return DefaultDashboard;
    }
  }, [user]);
  
  return {
    DashboardComponent,
    userRole: user?.role || 'guest',
    hasPermission: permissions.hasPermission
  };
};

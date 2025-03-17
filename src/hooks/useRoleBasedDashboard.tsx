
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { UserRole } from '@/types/auth';

/**
 * Hook to determine which dashboard component to display based on user role
 */
export const useRoleBasedDashboard = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Get the dashboard component based on user role
  const DashboardComponent = React.useMemo(() => {
    if (!user?.role) {
      // Default dashboard for users without a role
      return () => (
        <div className="p-6">
          <h2 className="text-xl font-semibold">Welcome to OmniCare</h2>
          <p className="text-muted-foreground mt-2">Please contact an administrator to assign a role.</p>
        </div>
      );
    }
    
    // Try to get a role-specific dashboard from the registry
    const registeredDashboard = componentRegistry.getComponent(
      'dashboard', 
      user.role as UserRole
    );
    
    if (registeredDashboard) {
      return registeredDashboard;
    }
    
    // Fallback for when no dashboard is registered for the role
    return () => (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
        <p className="text-muted-foreground mt-2">Your role is: {user.role}</p>
      </div>
    );
  }, [user]);
  
  return {
    DashboardComponent,
    userRole: user?.role || 'guest',
    hasPermission: permissions.hasPermission
  };
};

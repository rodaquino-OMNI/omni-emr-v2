
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  DoctorDashboard, 
  NurseDashboard, 
  AdminDashboard, 
  PharmacistDashboard, 
  DefaultDashboard 
} from '@/registry/entrypoints';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { UserRole } from '@/types/auth';

export const useRoleBasedDashboard = () => {
  const { user } = useAuth();
  const { getRoleDashboard } = usePermissions(user);
  
  // Get dashboard type based on user role
  const dashboardType = getRoleDashboard();
  
  // Get the component from registry if available
  const getDashboardComponent = (): React.ComponentType => {
    // Try to get from component registry first
    if (user?.role) {
      const registryComponent = componentRegistry.getComponent('dashboard', user.role as UserRole);
      if (registryComponent) {
        return registryComponent;
      }
    }
    
    // Fall back to hardcoded mapping if registry doesn't have a component
    switch (dashboardType) {
      case 'physician':
        return DoctorDashboard;
      case 'nurse':
        return NurseDashboard;
      case 'administrative':
        return AdminDashboard;
      case 'pharmacist':
        return PharmacistDashboard;
      default:
        return DefaultDashboard;
    }
  };
  
  return {
    dashboardType,
    DashboardComponent: getDashboardComponent()
  };
};

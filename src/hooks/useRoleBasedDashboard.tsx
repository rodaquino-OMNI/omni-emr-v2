
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

export const useRoleBasedDashboard = () => {
  const { user } = useAuth();
  const { getRoleDashboard } = usePermissions(user);
  
  // Get dashboard type based on user role
  const dashboardType = getRoleDashboard();
  
  // Return the appropriate dashboard component based on role
  const getDashboardComponent = (): React.ComponentType => {
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

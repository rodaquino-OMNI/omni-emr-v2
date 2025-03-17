
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import DefaultDashboard from '@/components/dashboard/DefaultDashboard';

export const useRoleBasedDashboard = () => {
  const { user } = useAuth();
  
  // Default to the standard dashboard component
  let DashboardComponent = DefaultDashboard;
  
  // If user role is doctor, use DoctorDashboard or fall back to DefaultDashboard
  if (user?.role === 'doctor') {
    try {
      // Dynamically import if possible, otherwise use default
      const DoctorDashboard = React.lazy(() => import('@/registry/entrypoints/DoctorDashboard'));
      DashboardComponent = () => (
        <React.Suspense fallback={<div>Loading doctor dashboard...</div>}>
          <DoctorDashboard />
        </React.Suspense>
      );
    } catch (e) {
      console.warn('Doctor dashboard not available, using default');
    }
  }
  
  // If user role is nurse, use NurseDashboard or fall back to DefaultDashboard
  if (user?.role === 'nurse') {
    try {
      // Dynamically import if possible, otherwise use default
      const NurseDashboard = React.lazy(() => import('@/registry/entrypoints/NurseDashboard'));
      DashboardComponent = () => (
        <React.Suspense fallback={<div>Loading nurse dashboard...</div>}>
          <NurseDashboard />
        </React.Suspense>
      );
    } catch (e) {
      console.warn('Nurse dashboard not available, using default');
    }
  }
  
  return {
    DashboardComponent
  };
};

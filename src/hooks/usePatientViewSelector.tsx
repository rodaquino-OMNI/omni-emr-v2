
import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import {
  DefaultPatientView,
  DoctorPatientView,
  NursePatientView,
  TechnicianPatientView,
} from '@/components/patients/views';

// Define view mapping types
type PatientViewComponent = React.ComponentType<{ patientId: string }>;
type RoleViewMapping = Record<string, PatientViewComponent>;

/**
 * Hook that determines which patient view component to display based on user role
 */
export const usePatientViewSelector = (patientId: string) => {
  const { user } = useAuth();
  
  // Create the role-to-view mapping only once
  const roleViewMapping = useMemo<RoleViewMapping>(() => ({
    // Clinical staff
    'doctor': DoctorPatientView,
    'physician': DoctorPatientView,
    'specialist': DoctorPatientView,
    
    // Nursing staff
    'nurse': NursePatientView,
    
    // Technical staff
    'lab_technician': TechnicianPatientView,
    'radiology_technician': TechnicianPatientView,
    'medical_assistant': TechnicianPatientView,
    
    // Default catches all other roles
    'default': DefaultPatientView
  }), []);

  // Get the view component based on user role, with fallbacks
  const getViewForRole = useMemo(() => {
    // First try to get component from registry if available
    if (user?.role) {
      const registryComponent = componentRegistry.getComponent(
        'patientView', 
        user.role as UserRole
      );
      
      if (registryComponent) {
        return registryComponent;
      }
      
      // Then check the direct role mapping
      const ViewComponent = roleViewMapping[user.role];
      if (ViewComponent) {
        return ViewComponent;
      }
    }
    
    // Default fallback
    return DefaultPatientView;
  }, [user, roleViewMapping]);

  return {
    ViewComponent: getViewForRole,
    userRole: user?.role || 'guest',
  };
};

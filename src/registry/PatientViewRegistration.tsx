
import React from 'react';
import { componentRegistry } from './RoleComponentRegistry';
import { UserRole } from '@/types/auth';
import { 
  DefaultPatientView,
  DoctorPatientView, 
  NursePatientView, 
  TechnicianPatientView,
  MedicalStaffPatientView
} from '@/components/patients/views';

/**
 * Register all patient view components with the role registry
 * This allows for dynamic resolution of components based on user role
 */
export const registerPatientViews = () => {
  // Register doctor/physician view (highest priority)
  componentRegistry.register(
    'patientView',
    DoctorPatientView,
    ['doctor', 'physician', 'specialist'] as UserRole[],
    100
  );
  
  // Register nurse view
  componentRegistry.register(
    'patientView',
    NursePatientView,
    ['nurse'] as UserRole[],
    90
  );
  
  // Register technician view
  componentRegistry.register(
    'patientView',
    TechnicianPatientView,
    ['lab_technician', 'radiology_technician', 'medical_assistant'] as UserRole[],
    80
  );
  
  // Register medical staff view
  componentRegistry.register(
    'patientView',
    MedicalStaffPatientView,
    ['medical_staff', 'therapist', 'caregiver'] as UserRole[],
    70
  );
  
  // Register default view (lowest priority)
  componentRegistry.register(
    'patientView',
    DefaultPatientView,
    ['all'] as UserRole[],
    0
  );
};

// Auto-register views
registerPatientViews();

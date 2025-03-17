
// Re-export all permission-related functions
import { canAccessPatientData } from './patientAccess';
import { canPerformAppointmentAction } from './appointmentManagement';
import { canPerformMedicationAction } from './medicationManagement';
import { 
  canPerformClinicalDocumentation,
  canPerformClinicalAssessment, 
  canDocumentMedicalDecisionMaking 
} from './clinicalDocumentation';

// Export the functions
export {
  canAccessPatientData,
  canPerformAppointmentAction,
  canPerformMedicationAction,
  canPerformClinicalDocumentation,
  canPerformClinicalAssessment, 
  canDocumentMedicalDecisionMaking
};

// Re-export clinical workflow permissions
export { 
  canPerformEmergencyCare,
  canPerformCareCoordination,
  canPerformTelemedicine,
  canManageFluidBalance,
  canPerformTriageAssessment
} from './clinicalWorkflows';

// This file is the central location for permission-related functions
// New permissions should be added here as needed

// Example permission utility for checking if a user has a specific permission
export const hasPermission = (user: any, permission: string): boolean => {
  if (!user || !user.permissions) return false;
  
  // Admin has all permissions
  if (user.role === 'admin' || user.role === 'system_administrator') return true;
  
  // Check if user has this specific permission or 'all' permissions
  return user.permissions.includes(permission) || user.permissions.includes('all');
};

// Get all permissions for a user
export const getUserPermissions = (user: any): string[] => {
  if (!user) return [];
  return user.permissions || [];
};

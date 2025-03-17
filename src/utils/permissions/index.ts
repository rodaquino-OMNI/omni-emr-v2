
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

// Emergency care permissions
export const canPerformEmergencyCare = (user: any): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'emergency_staff'].includes(user.role);
};

// Care coordination permissions
export const canPerformCareCoordination = (user: any): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'care_coordinator'].includes(user.role);
};

// Telemedicine permissions
export const canPerformTelemedicine = (user: any): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'specialist'].includes(user.role);
};

// Fluid balance permissions
export const canManageFluidBalance = (user: any): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse'].includes(user.role);
};

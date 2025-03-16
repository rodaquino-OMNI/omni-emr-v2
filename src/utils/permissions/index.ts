
// Export all permission utility functions from a single file
export { canAccessPatientData } from './patientAccess';
export { canPerformAppointmentAction } from './appointmentManagement';
export { canPerformMedicationAction } from './medicationManagement';
export { 
  canPerformClinicalDocumentation,
  canPerformClinicalAssessment,
  canDocumentMedicalDecisionMaking
} from './clinicalDocumentation';

// Re-export permissions types 
export { permissionCategories, sharedPermissions, allPermissions } from './permissionTypes';
export { rolePermissions } from './roleDefinitions';

// Add missing functions
import { User, UserRole } from '@/types/auth';

export const canModifyPatient = (user: User | null, patientId: string): boolean => {
  if (!user) return false;
  
  // Only certain roles can modify patient data
  return ['admin', 'doctor', 'nurse'].includes(user.role as UserRole);
};

export const canAssignPatient = (user: User | null): boolean => {
  if (!user) return false;
  
  // These roles can assign/unassign patients
  return ['doctor', 'nurse', 'admin', 'team_lead'].includes(user.role as UserRole);
};

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user || !user.permissions) return false;
  
  // Admin has all permissions
  if (user.role === 'admin' || user.role === 'system_administrator') return true;
  
  // Check if user has this specific permission or 'all' permissions
  return user.permissions.includes(permission) || user.permissions.includes('all');
};

export const getUserPermissions = (user: User | null): string[] => {
  if (!user) return [];
  return user.permissions || [];
};

export const canPerformEmergencyCare = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'emergency_staff'].includes(user.role as UserRole);
};

export const canPerformCareCoordination = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'care_coordinator'].includes(user.role as UserRole);
};

export const canPerformTelemedicine = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'specialist'].includes(user.role as UserRole);
};

export const canManageFluidBalance = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse'].includes(user.role as UserRole);
};

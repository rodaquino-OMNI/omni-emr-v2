
import { User } from '@/types/auth';
import { 
  canAccessPatientData, 
  canPerformAppointmentAction,
  canPerformMedicationAction,
  canPerformClinicalDocumentation,
  canPerformClinicalAssessment as importedClinicalAssessment, 
  canDocumentMedicalDecisionMaking,
  hasPermission as permissionCheck,
  getUserPermissions as getPermissions
} from './permissions/index';

// Re-export the hasPermission function for general use
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
  return ['doctor', 'nurse', 'emergency_staff'].includes(user.role as string);
};

export const canPerformCareCoordination = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'care_coordinator'].includes(user.role as string);
};

export const canPerformTelemedicine = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'specialist'].includes(user.role as string);
};

export const canManageFluidBalance = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse'].includes(user.role as string);
};

// Re-export renamed imported function to avoid conflict
export { importedClinicalAssessment as canPerformClinicalAssessment };

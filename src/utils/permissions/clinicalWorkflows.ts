
import { User, UserRole } from '@/types/auth';

// Check if user can perform emergency care
export const canPerformEmergencyCare = (
  user: User | null,
  action: 'triage' | 'treatment' | 'view'
): boolean => {
  if (!user) return false;
  
  if (action === 'triage') {
    return ['doctor', 'nurse', 'administrative'].includes(user.role as UserRole);
  } else if (action === 'treatment') {
    return ['doctor', 'nurse'].includes(user.role as UserRole);
  } else if (action === 'view') {
    return ['doctor', 'nurse', 'administrative', 'system_administrator'].includes(user.role as UserRole);
  }
  
  return false;
};

// Check if user can perform care coordination
export const canPerformCareCoordination = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'coordinator'].includes(user.role as UserRole);
};

// Check if user can perform telemedicine
export const canPerformTelemedicine = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'specialist', 'therapist'].includes(user.role as UserRole);
};

// Check if user can manage fluid balance
export const canManageFluidBalance = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse'].includes(user.role as UserRole);
};

// Check if user can perform triage assessment
export const canPerformTriageAssessment = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'administrative'].includes(user.role as UserRole);
};

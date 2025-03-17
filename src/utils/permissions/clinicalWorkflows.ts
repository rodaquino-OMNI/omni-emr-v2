
import { User } from '@/types/auth';

// Check if a user can perform emergency care actions
export const canPerformEmergencyCare = (user: User | null, action: 'triage' | 'treatment'): boolean => {
  if (!user) return false;
  
  if (action === 'triage') {
    return ['doctor', 'nurse'].includes(user.role);
  } else if (action === 'treatment') {
    return ['doctor', 'nurse'].includes(user.role);
  }
  
  return false;
};

// Check if a user can perform care coordination activities
export const canPerformCareCoordination = (user: User | null, activity: 'planning' | 'transition'): boolean => {
  if (!user) return false;
  
  if (activity === 'planning' || activity === 'transition') {
    return ['doctor', 'nurse', 'care_coordinator'].includes(user.role);
  }
  
  return false;
};

// Check if a user can perform telemedicine
export const canPerformTelemedicine = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'specialist'].includes(user.role);
};

// Check if a user can manage fluid balance
export const canManageFluidBalance = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse'].includes(user.role);
};

// Check if a user can perform triage assessment
export const canPerformTriageAssessment = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse'].includes(user.role);
};

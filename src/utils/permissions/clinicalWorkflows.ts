
import { User } from '../../types/auth';
import { hasPermission } from './roleChecks';

// Emergency care specific permission checks
export const canPerformEmergencyCare = (user: User | null, action: 'triage' | 'treatment'): boolean => {
  if (!user) return false;
  
  if (user.role === 'doctor' || user.role === 'admin' || user.role === 'system_administrator') {
    return true;
  }
  
  switch (action) {
    case 'triage':
      return hasPermission(user, 'perform_triage');
    case 'treatment':
      return hasPermission(user, 'perform_emergency_treatment');
    default:
      return false;
  }
};

// Care coordination specific permission checks
export const canPerformCareCoordination = (user: User | null, action: 'planning' | 'transition'): boolean => {
  if (!user) return false;
  
  if (user.role === 'doctor' || user.role === 'admin' || user.role === 'system_administrator') {
    return true;
  }
  
  switch (action) {
    case 'planning':
      return hasPermission(user, 'create_care_plan');
    case 'transition':
      return hasPermission(user, 'manage_care_transitions');
    default:
      return false;
  }
};

// Telemedicine permission check
export const canPerformTelemedicine = (user: User | null): boolean => {
  if (!user) return false;
  
  return hasPermission(user, 'telemedicine');
};

// Fluid balance management permission check
export const canManageFluidBalance = (user: User | null): boolean => {
  if (!user) return false;
  
  return hasPermission(user, 'document_fluid_balance') || 
         hasPermission(user, 'manage_fluid_balance');
};

// Triage assessment permission check
export const canPerformTriageAssessment = (user: User | null): boolean => {
  if (!user) return false;
  
  return user.role === 'nurse' || 
         hasPermission(user, 'perform_triage');
};

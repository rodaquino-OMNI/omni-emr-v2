
import { User } from '../../types/auth';
import { hasPermission } from './roleChecks';

// Check if user has permission for specific clinical documentation action
export const canPerformClinicalDocumentation = (user: User | null, action: 'create' | 'modify' | 'finalize' | 'view'): boolean => {
  if (!user) return false;
  
  switch (action) {
    case 'create':
      return hasPermission(user, 'create_clinical_notes');
    case 'modify':
      return hasPermission(user, 'edit_records');
    case 'finalize':
      return hasPermission(user, 'finalize_clinical_documentation');
    case 'view':
      return hasPermission(user, 'view_records') || 
             hasPermission(user, 'view_own_records');
    default:
      return false;
  }
};

// Check if user can perform specific clinical assessment
export const canPerformClinicalAssessment = (user: User | null, action: 'initial' | 'ongoing'): boolean => {
  if (!user) return false;
  
  if (user.role === 'doctor' || user.role === 'admin' || user.role === 'system_administrator') {
    return true;
  }
  
  switch (action) {
    case 'initial':
      return hasPermission(user, 'perform_initial_assessment');
    case 'ongoing':
      return hasPermission(user, 'perform_ongoing_assessment');
    default:
      return false;
  }
};

// Check if user can document medical decision making
export const canDocumentMedicalDecisionMaking = (user: User | null): boolean => {
  if (!user) return false;
  
  return user.role === 'doctor' || 
         hasPermission(user, 'document_medical_decision_making');
};


import { User } from '@/types/auth';

// Clinical documentation permissions
export const canPerformClinicalDocumentation = (user: User): boolean => {
  if (!user) return false;
  
  const allowedRoles = ['doctor', 'physician', 'nurse', 'specialist'];
  return allowedRoles.includes(user.role || '');
};

export const canPerformClinicalAssessment = (user: User): boolean => {
  if (!user) return false;
  
  const allowedRoles = ['doctor', 'physician', 'nurse', 'specialist'];
  return allowedRoles.includes(user.role || '');
};

export const canDocumentMedicalDecisionMaking = (user: User): boolean => {
  if (!user) return false;
  
  const allowedRoles = ['doctor', 'physician', 'specialist'];
  return allowedRoles.includes(user.role || '');
};

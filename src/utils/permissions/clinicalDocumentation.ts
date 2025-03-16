
import { User, UserRole } from '@/types/auth';

// Check if user can perform clinical documentation
export const canPerformClinicalDocumentation = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'specialist', 'therapist'].includes(user.role as UserRole);
};

// Check if user can perform clinical assessment
export const canPerformClinicalAssessment = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'nurse', 'specialist'].includes(user.role as UserRole);
};

// Check if user can document medical decision making
export const canDocumentMedicalDecisionMaking = (user: User | null): boolean => {
  if (!user) return false;
  return ['doctor', 'specialist'].includes(user.role as UserRole);
};

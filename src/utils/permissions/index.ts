
// Export all permission utility functions from a single file
export { canAccessPatientData } from './patientAccess';
export { canPerformAppointmentAction } from './appointmentManagement';
export { canPerformMedicationAction } from './medicationManagement';
export { 
  canPerformClinicalDocumentation,
  canPerformClinicalAssessment,
  canDocumentMedicalDecisionMaking
} from './clinicalDocumentation';

// Additional permission check for patient modification
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


// Export permission data structures
export { 
  permissionCategories,
  sharedPermissions,
  rolePermissions,
  allPermissions
} from '../permissions';

// Export permission utility functions
export { hasPermission, getUserPermissions } from './roleChecks';
export { canAccessPatientData } from './patientAccess';
export { 
  canPerformClinicalDocumentation,
  canPerformClinicalAssessment,
  canDocumentMedicalDecisionMaking
} from './clinicalDocumentation';
export { canPerformMedicationAction } from './medicationManagement';
export { canPerformAppointmentAction } from './appointmentManagement';
export {
  canPerformEmergencyCare,
  canPerformCareCoordination,
  canPerformTelemedicine,
  canManageFluidBalance,
  canPerformTriageAssessment
} from './clinicalWorkflows';

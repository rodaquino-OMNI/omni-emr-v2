
// Re-export all permission utility functions from the refactored modules
// This file is maintained for backward compatibility

export {
  hasPermission,
  getUserPermissions,
  canAccessPatientData,
  canPerformClinicalDocumentation,
  canPerformMedicationAction,
  canPerformAppointmentAction,
  canPerformClinicalAssessment,
  canPerformEmergencyCare,
  canPerformCareCoordination,
  canPerformTelemedicine,
  canManageFluidBalance,
  canPerformTriageAssessment,
  canDocumentMedicalDecisionMaking
} from './permissions';


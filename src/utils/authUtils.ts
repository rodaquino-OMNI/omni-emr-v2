
// Re-export all auth utilities from their respective modules
export { rolePermissions, sharedPermissions, permissionCategories } from './permissions/permissionTypes';
export { 
  hasPermission, 
  getUserPermissions
} from './permissions/roleChecks';
export { 
  canAccessPatientData
} from './permissions/patientAccess';
export {
  canPerformClinicalDocumentation,
  canPerformMedicationAction,
  canPerformAppointmentAction
} from './permissions';
export { 
  signInWithProvider, 
  signInWithEmail, 
  signOut, 
  refreshSession, 
  hasEnabledMFA, 
  signInWithPhone, 
  verifyPhoneOTP 
} from './authenticationUtils';
export { signUpWithEmail } from './signUpUtils';
export { mapSupabaseUserToUser } from './userMappingUtils';

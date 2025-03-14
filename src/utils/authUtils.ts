
// Re-export all auth utilities from their respective modules
export { rolePermissions, sharedPermissions, permissionCategories } from './permissions';
export { 
  hasPermission, 
  canAccessPatientData, 
  getUserPermissions,
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

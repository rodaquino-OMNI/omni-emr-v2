
// Re-export all auth utilities from their respective modules
export { 
  permissionCategories, 
  sharedPermissions 
} from './permissions/permissionTypes';

export { rolePermissions } from './permissions/roleDefinitions';

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
} from './permissions/index';

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

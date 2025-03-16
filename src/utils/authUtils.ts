
// Re-export only the necessary utilities from their respective modules
export { 
  permissionCategories, 
  sharedPermissions 
} from './permissions/permissionTypes';

export { rolePermissions } from './permissions/roleDefinitions';

export { 
  hasPermission, 
  getUserPermissions,
  canAccessPatientData,
  canPerformClinicalDocumentation,
  canPerformMedicationAction,
  canPerformAppointmentAction
} from './permissions/index';

// Only include authentication functions that aren't already in more specific modules
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

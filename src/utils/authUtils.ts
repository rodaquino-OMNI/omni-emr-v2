
// Re-export all auth utilities from their respective modules
export { rolePermissions } from './permissions';
export { hasPermission, canAccessPatientData } from './permissionUtils';
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


// Re-export all authentication utilities from their respective modules
// This file is kept for backward compatibility

// Import and export only the functions that are actually used
import { signInWithProvider } from './auth/providerAuth';
import { signInWithEmail } from './auth/emailAuth';
import { signInWithPhone, verifyPhoneOTP } from './auth/phoneAuth';
import { signOut, refreshSession } from './auth/sessionUtils';
import { hasEnabledMFA } from './auth/securityUtils';

export {
  signInWithProvider,
  signInWithEmail,
  signInWithPhone,
  verifyPhoneOTP,
  signOut,
  refreshSession,
  hasEnabledMFA
};

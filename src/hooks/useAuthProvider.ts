import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Languages } from '../types/auth';
import { useLanguageSettings } from './useLanguageSettings';
import { useAuthState } from './useAuthState';
import { useAuthLogin } from './useAuthLogin';
import { useAuthLogout } from './useAuthLogout';
import { useSessionTimeoutHook } from './auth/useSessionTimeoutHook';
import { useAuthRateLimiting } from './useAuthRateLimiting';
import { usePermissions } from './usePermissions';
import { useAuthProviderState } from './auth/useAuthProviderState';
import { useSessionRefresh } from './auth/useSessionRefresh';
import { useSocialAuth } from './auth/useSocialAuth';
import { useSignUpAuth } from './auth/useSignUpAuth';
import { useEmailAuth } from './auth/useEmailAuth';

export const useAuthProvider = () => {
  // Initialize language settings
  const { language, setLanguage } = useLanguageSettings();

  // Initialize auth state from our simpler state hook
  const {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    isAuthenticated
  } = useAuthProviderState();

  // Set isAuthenticated function for API compatibility
  const setIsAuthenticated = () => {
    // This is a derived value, but needed for type compatibility
    console.log("setIsAuthenticated called - this is a derived value");
  };

  // Initialize session refresh functionality
  const { startSessionRefreshTimer } = useSessionRefresh();

  // Initialize auth rate limiting
  const { 
    handleLoginRateLimit, 
    resetLoginAttempts 
  } = useAuthRateLimiting(language);

  // Initialize social login functionality
  const { loginWithSocial: socialLogin } = useSocialAuth(language);

  // Initialize sign up functionality
  const { signUp } = useSignUpAuth(setIsLoading, language);

  // Initialize email login and reset password functionality
  const { login, resetPassword } = useEmailAuth(
    setUser,
    setSession,
    setIsLoading,
    handleLoginRateLimit,
    resetLoginAttempts,
    language,
    startSessionRefreshTimer
  );

  // Initialize logout functionality
  const { logout } = useAuthLogout(user, setUser, setSession, language);

  // Initialize session timeout
  const { 
    lastActivity, 
    sessionTimeoutMinutes, 
    setSessionTimeoutMinutes,
    updateLastActivity 
  } = useSessionTimeoutHook({
    isAuthenticated,
    language,
    onTimeout: logout
  });

  // Initialize permissions
  const { hasPermission, canAccessPatientData } = usePermissions(user);

  // Mock function for updating user - would connect to backend in real implementation
  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  // Mock function for checking auth status - would connect to backend in real implementation
  const checkAuthStatus = async (): Promise<boolean> => {
    // Implementation would verify session validity with backend
    console.log("Checking auth status");
    return isAuthenticated;
  };

  // Create and return the auth context value with all required properties
  return {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    setIsLoading,
    language,
    setLanguage,
    login,
    loginWithSocial: socialLogin,
    signUp,
    resetPassword,
    logout,
    updateUser,
    checkAuthStatus,
    session,
    hasPermission,
    canAccessPatientData,
    lastActivity,
    updateLastActivity,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes
  };
};

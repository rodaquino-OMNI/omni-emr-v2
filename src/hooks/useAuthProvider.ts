
import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { useLanguageSettings } from './useLanguageSettings';
import { useAuthState } from './useAuthState';
import { useAuthLogin } from './useAuthLogin';
import { useAuthLogout } from './useAuthLogout';
import { useSessionTimeoutHook } from './auth/useSessionTimeoutHook';
import { useAuthRateLimiting } from './useAuthRateLimiting';
import { usePermissions } from './usePermissions';
import { useAuthProviderState } from './auth/useAuthProviderState';
import { useSessionRefresh } from './auth/useSessionRefresh';

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

  // Initialize session refresh functionality
  const { startSessionRefreshTimer } = useSessionRefresh();

  // Initialize auth rate limiting
  const { 
    handleLoginRateLimit, 
    resetLoginAttempts 
  } = useAuthRateLimiting(language);

  // Initialize login functionality
  const {
    login,
    loginWithSocial,
    signUp,
    resetPassword
  } = useAuthLogin(
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
    setSessionTimeoutMinutes 
  } = useSessionTimeoutHook({
    isAuthenticated,
    language,
    onTimeout: logout
  });

  // Initialize permissions
  const { hasPermission, canAccessPatientData } = usePermissions(user);

  return {
    user,
    isAuthenticated,
    isLoading,
    language,
    setLanguage,
    login,
    loginWithSocial,
    signUp,
    resetPassword,
    logout,
    session,
    hasPermission,
    canAccessPatientData,
    lastActivity,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes
  };
};

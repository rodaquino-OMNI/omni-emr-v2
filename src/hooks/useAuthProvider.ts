
import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { useLanguageSettings } from './useLanguageSettings';
import { useAuthState } from './useAuthState';
import { useAuthLogin } from './useAuthLogin';
import { useAuthLogout } from './useAuthLogout';
import { useSessionTimeout } from './useSessionTimeout';
import { useAuthRateLimiting } from './useAuthRateLimiting';
import { usePermissions } from './usePermissions';

export const useAuthProvider = () => {
  // Initialize language settings
  const { language, setLanguage } = useLanguageSettings();

  // Initialize auth state
  const {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading
  } = useAuthState(language);

  // Initialize auth rate limiting
  const { 
    handleLoginRateLimit, 
    resetLoginAttempts 
  } = useAuthRateLimiting(language);

  // Initialize login functionality
  const {
    login,
    loginWithSocial,
    signUp
  } = useAuthLogin(
    setUser,
    setSession,
    setIsLoading,
    handleLoginRateLimit,
    resetLoginAttempts,
    language
  );

  // Initialize logout functionality
  const { logout } = useAuthLogout(user, setUser, setSession, language);

  // Initialize session timeout
  const { 
    lastActivity, 
    sessionTimeoutMinutes, 
    setSessionTimeoutMinutes 
  } = useSessionTimeout({
    isAuthenticated: !!user,
    language,
    onTimeout: logout
  });

  // Initialize permissions
  const { hasPermission, canAccessPatientData } = usePermissions(user);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    language,
    setLanguage,
    login,
    loginWithSocial,
    signUp,
    logout,
    session,
    hasPermission,
    canAccessPatientData,
    lastActivity,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes
  };
};

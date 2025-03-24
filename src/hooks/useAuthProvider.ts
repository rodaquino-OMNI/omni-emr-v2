import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Languages } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { isMockMode, mockAuth } from '../services/mockService';

// Check if we're in mock mode
const MOCK_MODE = isMockMode || import.meta.env.VITE_MOCK_MODE === 'true';
console.log('Auth Provider - Mock Mode:', MOCK_MODE ? 'Enabled' : 'Disabled');
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

// Function to map Supabase user to User interface
const mapSupabaseUserToUser = (supabaseUser: any) => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.name || '', // Provide a default value
    role: supabaseUser.role as UserRole, // Cast to UserRole
    permissions: [], // Initialize with empty array, populate as needed
    avatar_url: supabaseUser.user_metadata?.avatar_url,
    app_metadata: supabaseUser.app_metadata,
    user_metadata: supabaseUser.user_metadata,
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at,
    last_sign_in_at: supabaseUser.last_sign_in_at,
    aud: supabaseUser.aud,
    confirmed_at: supabaseUser.confirmed_at,
    recovery_sent_at: supabaseUser.recovery_sent_at,
    confirmation_sent_at: supabaseUser.confirmation_sent_at,
    organization: supabaseUser.user_metadata?.organization,
    approvalStatus: supabaseUser.user_metadata?.approvalStatus,
    status: supabaseUser.user_metadata?.status,
    phoneNumber: supabaseUser.phone,
    mfaEnabled: !!supabaseUser.factors?.length,
    createdAt: supabaseUser.created_at ? new Date(supabaseUser.created_at) : undefined,
    lastLogin: supabaseUser.last_sign_in_at
      ? new Date(supabaseUser.last_sign_in_at)
      : undefined,
    profileImageUrl: supabaseUser.user_metadata?.avatar_url,
    country: supabaseUser.user_metadata?.country,
    insurance: supabaseUser.user_metadata?.insurance,
  };
};

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

  // Initialize social login functionality
  const { loginWithSocial: socialLogin } = useSocialAuth(language);

  // Initialize sign up functionality
  const { signUp } = useSignUpAuth(setIsLoading, language);

  // Initialize email login and reset password functionality
  // Initialize email login and reset password functionality
  const { login: realLogin, resetPassword: realResetPassword } = useEmailAuth(
    setUser,
    setSession,
    setIsLoading,
    handleLoginRateLimit,
    resetLoginAttempts,
    language,
    startSessionRefreshTimer
  );
  
  // Use mock authentication in mock mode
  const login = MOCK_MODE
    ? async (email: string, password: string) => {
        console.log('Using mock login for:', email);
        try {
          const result = await mockAuth.login(email, password);
          console.log('Mock login result:', result);
          
          if (result.success && result.user) {
            console.log('Mock login successful, setting user:', result.user);
            setUser(result.user);
            setSession({ user: result.user } as Session);
            return { success: true };
          }
          
          console.log('Mock login failed:', result.error || 'Unknown error');
          return { success: false, error: result.error || 'Login failed' };
        } catch (error) {
          console.error('Error in mock login:', error);
          return { success: false, error: 'Login failed due to an error' };
        }
      }
    : realLogin;
    
  const resetPassword = MOCK_MODE
    ? async (email: string) => {
        console.log('Using mock reset password for:', email);
        return mockAuth.resetPassword(email);
      }
    : realResetPassword;

  // Initialize logout functionality
  const { logout } = useAuthLogout(user, setUser, setSession, language);

  // Initialize session timeout
  const { 
    lastActivity, 
    sessionTimeoutMinutes, 
    setSessionTimeoutMinutes,
    updateLastActivity 
  } = useSessionTimeoutHook({
    timeoutMinutes: 30,
    defaultTimeoutMinutes: 30,
    warningThresholdMinutes: 5,
    isAuthenticated: isAuthenticated,
    language: language,
    onTimeout: logout
  });

  // Initialize permissions
  const { hasPermission, canAccessPatientData } = usePermissions(user);

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) {
      console.error('Error updating user:', error.message);
      // Handle specific error codes if needed
      // if (error.code === '...') { ... }
      // TODO: Consider using a toast or other UI element to display the error
    } else {
      setUser(mapSupabaseUserToUser(data.user));
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    // If in mock mode, use mock authentication
    if (MOCK_MODE) {
      console.log('Using mock authentication');
      try {
        const { user } = await mockAuth.getSession();
        if (user) {
          setSession({ user } as Session);
          setUser(user);
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.error('Error in mock authentication:', error);
      }
      
      setIsLoading(false);
      return false;
    }
    
    // Otherwise use real Supabase authentication
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error checking auth status:', error.message);
      setIsLoading(false);
      setSession(null);
      setUser(null);
      return false;
    }

    if (session) {
      setSession(session);
      setUser(mapSupabaseUserToUser(session.user));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  // Create and return the auth context value with all required properties
  return {
    user,
    setUser,
    isAuthenticated,
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

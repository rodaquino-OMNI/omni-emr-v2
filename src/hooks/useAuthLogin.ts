
import { Session } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { useEmailAuth } from './auth/useEmailAuth';
import { useSocialAuth } from './auth/useSocialAuth';
import { useSignUpAuth } from './auth/useSignUpAuth';

export const useAuthLogin = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  handleLoginRateLimit: () => void,
  resetLoginAttempts: () => void,
  language: Language,
  startSessionRefreshTimer: (session: Session | null) => void
) => {
  // Initialize email auth
  const { login, resetPassword } = useEmailAuth(
    setUser,
    setSession,
    setIsLoading,
    handleLoginRateLimit,
    resetLoginAttempts,
    language,
    startSessionRefreshTimer
  );

  // Initialize social auth
  const { loginWithSocial } = useSocialAuth(language);

  // Initialize sign up auth
  const { signUp } = useSignUpAuth(setIsLoading, language);

  return {
    login,
    loginWithSocial,
    signUp,
    resetPassword
  };
};

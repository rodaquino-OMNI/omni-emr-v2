
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, Language } from '../types/auth';
import { useEmailAuth } from './auth/useEmailAuth';
import { useSocialAuth } from './auth/useSocialAuth';
import { useSignUpAuth } from './auth/useSignUpAuth';
import { useSessionRefresh } from './auth/useSessionRefresh';
import { useAuthError } from './auth/useAuthError';

export const useAuthLogin = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  handleLoginRateLimit: () => void,
  resetLoginAttempts: () => void,
  language: Language
) => {
  const [requiresMFA, setRequiresMFA] = useState<boolean>(false);
  const [passwordResetSent, setPasswordResetSent] = useState<boolean>(false);

  // Set up session refresh hook
  const { startSessionRefreshTimer } = useSessionRefresh();

  // Set up auth error handling
  const { lastError } = useAuthError(language);

  // Set up email auth hooks
  const { login, resetPassword } = useEmailAuth(
    setUser,
    setSession,
    setIsLoading,
    handleLoginRateLimit,
    resetLoginAttempts,
    language,
    startSessionRefreshTimer
  );

  // Set up social auth hooks
  const { loginWithSocial } = useSocialAuth(language);

  // Set up signup auth hooks
  const { signUp } = useSignUpAuth(setIsLoading, language);

  return {
    login,
    loginWithSocial,
    signUp,
    resetPassword,
    requiresMFA,
    passwordResetSent,
    lastError,
  };
};

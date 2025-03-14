
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { User, Language } from '@/types/auth';
import { signInWithEmail } from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuthError } from './useAuthError';

export const useEmailAuth = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  handleLoginRateLimit: () => void,
  resetLoginAttempts: () => void,
  language: Language,
  startSessionRefreshTimer: (session: Session | null) => void
) => {
  const { handleAuthError, getErrorMessage } = useAuthError(language);

  // Handle login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check rate limiting
      handleLoginRateLimit();
      
      const { user: authUser, session: authSession } = await signInWithEmail(email, password);
      
      if (!authUser) {
        throw new Error(language === 'pt' 
          ? 'Falha ao fazer login: Credenciais inválidas' 
          : 'Login failed: Invalid credentials');
      }
      
      // Check for MFA if not a mock user
      if (!('role' in authUser) && authUser.id) {
        const mfaEnabled = await import('@/utils/authUtils').then(
          module => module.hasEnabledMFA(authUser.id)
        );
        if (mfaEnabled) {
          // At this point, you would redirect to MFA verification
          // For now, we'll continue the flow
        }
      }
      
      // Process user data
      if ('role' in authUser) {
        // For mock users
        setUser(authUser as unknown as User);
      } else {
        // For real Supabase users
        const mappedUser = await import('@/utils/authUtils').then(
          module => module.mapSupabaseUserToUser(authUser)
        );
        setUser(mappedUser);
      }
      
      setSession(authSession);
      
      // Reset login attempts on successful login
      resetLoginAttempts();

      // Start session refresh timer
      startSessionRefreshTimer(authSession);
      
      return { success: true };
    } catch (error) {
      const authError = handleAuthError(error, language === 'pt' ? 'login' : 'login');
      const errorMessage = getErrorMessage(authError, 'login');
      
      toast.error(
        language === 'pt' ? 'Erro de login' : 'Login error', 
        { description: errorMessage }
      );
      
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [language, handleAuthError, getErrorMessage, handleLoginRateLimit, resetLoginAttempts, setIsLoading, setUser, setSession, startSessionRefreshTimer]);

  // Password reset
  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success(
        language === 'pt' ? 'Email enviado' : 'Email sent',
        { description: language === 'pt' 
            ? 'Instruções de recuperação enviadas para seu email' 
            : 'Recovery instructions sent to your email'
        }
      );
      
      return { success: true };
    } catch (error) {
      const authError = handleAuthError(error, language === 'pt' ? 'recuperação de senha' : 'password reset');
      const errorMessage = getErrorMessage(authError, 'password reset');
      
      toast.error(
        language === 'pt' ? 'Erro de recuperação' : 'Reset error',
        { description: errorMessage }
      );
      
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [language, handleAuthError, getErrorMessage, setIsLoading]);

  return {
    login,
    resetPassword
  };
};

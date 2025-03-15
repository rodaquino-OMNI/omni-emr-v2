
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { User, Language } from '@/types/auth';
import { signInWithEmail } from '@/utils/auth/emailAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAuthError } from './useAuthError';
import { mapSupabaseUserToUser } from '@/utils/userMappingUtils';
import { requestPasswordReset } from '@/utils/signUpUtils';

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
      
      const response = await signInWithEmail(email, password);
      
      // Safely handle the response
      if (!response) {
        throw new Error(language === 'pt' 
          ? 'Falha ao fazer login: Resposta inválida' 
          : 'Login failed: Invalid response');
      }
      
      const { user: authUser, session: authSession } = response;
      
      // Process user data with type safety
      if (authUser) {
        if ('role' in authUser) {
          // For mock users
          setUser(authUser as unknown as User);
        } else {
          // For real Supabase users
          const mappedUser = await mapSupabaseUserToUser(authUser);
          
          // Check if the user's account is approved
          if (mappedUser.approvalStatus === 'pending') {
            // Still set the user and session so the pending approval message can be shown
            setUser(mappedUser);
            setSession(authSession);
            
            // Return a special response for pending approval
            return { success: true, pendingApproval: true };
          } else if (mappedUser.approvalStatus === 'rejected') {
            throw new Error(language === 'pt'
              ? 'Sua conta foi rejeitada. Entre em contato com o suporte para mais informações.'
              : 'Your account has been rejected. Please contact support for more information.');
          }
          
          setUser(mappedUser);
        }
      } else {
        setUser(null);
        throw new Error(language === 'pt'
          ? 'Falha ao fazer login: Dados de usuário inválidos'
          : 'Login failed: Invalid user data');
      }
      
      setSession(authSession);
      
      // Reset login attempts on successful login
      resetLoginAttempts();

      // Start session refresh timer
      startSessionRefreshTimer(authSession);
      
      toast.success(
        language === 'pt' ? 'Login bem-sucedido' : 'Login successful', 
        { description: language === 'pt' ? 'Bem-vindo de volta!' : 'Welcome back!' }
      );
      
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
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        toast.success(
          language === 'pt' ? 'Email enviado' : 'Email sent',
          { description: language === 'pt' 
              ? 'Instruções de recuperação enviadas para seu email' 
              : 'Recovery instructions sent to your email'
          }
        );
      }
      
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

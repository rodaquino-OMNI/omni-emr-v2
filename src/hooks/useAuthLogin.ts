
import { useState, useCallback } from 'react';
import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { signInWithProvider, signInWithEmail, signUpWithEmail, hasEnabledMFA, refreshSession } from '../utils/authUtils';
import { generateCSRFToken } from '../utils/csrfUtils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthError extends Error {
  message: string;
  status?: number;
  code?: string;
}

export const useAuthLogin = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  handleLoginRateLimit: () => void,
  resetLoginAttempts: () => void,
  language: Language
) => {
  const [lastError, setLastError] = useState<AuthError | null>(null);
  const [requiresMFA, setRequiresMFA] = useState<boolean>(false);
  const [passwordResetSent, setPasswordResetSent] = useState<boolean>(false);

  // Common error handler to reduce duplication
  const handleAuthError = useCallback((error: any, context: string): AuthError => {
    const errorObj: AuthError = error instanceof Error 
      ? error 
      : new Error(error?.message || 'Unknown error');
    
    if (error?.status) errorObj.status = error.status;
    if (error?.code) errorObj.code = error.code;
    
    // Log with important details but avoid sensitive information
    console.error(`${context} error:`, {
      message: errorObj.message,
      status: errorObj.status,
      code: errorObj.code,
      // Don't log stack trace in production
      ...(process.env.NODE_ENV !== 'production' && { stack: errorObj.stack })
    });
    
    // Save last error for potential recovery strategies
    setLastError(errorObj);
    
    return errorObj;
  }, []);

  // Translate error messages based on language
  const getErrorMessage = useCallback((error: AuthError, context: string): string => {
    // Email already exists
    if (error.message?.includes('User already registered')) {
      return language === 'pt' 
        ? 'Este email já está registrado' 
        : 'This email is already registered';
    }
    
    // Invalid credentials
    if (error.message?.includes('Invalid login credentials')) {
      return language === 'pt'
        ? 'Credenciais inválidas'
        : 'Invalid login credentials';
    }

    // Rate limiting
    if (error.message?.includes('too many requests') || error.code === '429') {
      return language === 'pt'
        ? 'Muitas tentativas, tente novamente mais tarde'
        : 'Rate limited, please try again later';
    }
    
    // Network error
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return language === 'pt'
        ? 'Erro de conexão, verifique sua internet'
        : 'Connection error, check your internet';
    }

    // Default error message
    return error.message || (language === 'pt' 
      ? `Erro de ${context}` 
      : `${context} error`);
  }, [language]);

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
        const mfaEnabled = await hasEnabledMFA(authUser.id);
        if (mfaEnabled) {
          setRequiresMFA(true);
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
        const mappedUser = await import('../utils/authUtils').then(
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
  }, [language, handleAuthError, getErrorMessage, handleLoginRateLimit, resetLoginAttempts, setIsLoading, setUser, setSession]);

  // Handle social login with improved PKCE flow
  const loginWithSocial = useCallback(async (provider: Provider) => {
    try {
      // Generate new CSRF token for the OAuth flow
      generateCSRFToken();
      await signInWithProvider(provider);
      // Auth state change listener will handle user/session updates
      return { success: true };
    } catch (error) {
      const authError = handleAuthError(error, language === 'pt' ? 'login social' : 'social login');
      const errorMessage = getErrorMessage(authError, 'social login');
      
      toast.error(
        language === 'pt' ? 'Erro de login social' : 'Social login error', 
        { description: errorMessage }
      );
      
      return { success: false, error: authError };
    }
  }, [language, handleAuthError, getErrorMessage]);

  // New function to handle password reset
  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setPasswordResetSent(true);
      
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

  // Helper function to set up session refresh
  const startSessionRefreshTimer = (session: Session | null) => {
    if (!session?.expires_at) return;
    
    // Calculate when to refresh (5 minutes before expiry)
    const expiryTime = new Date(session.expires_at * 1000);
    const refreshTime = new Date(expiryTime.getTime() - 5 * 60 * 1000);
    const now = new Date();
    
    // Set timeout to refresh session
    const timeoutMs = Math.max(0, refreshTime.getTime() - now.getTime());
    setTimeout(() => {
      refreshSession()
        .then(success => {
          if (!success) {
            console.warn('Session refresh failed, user may need to re-login');
          }
        })
        .catch(err => console.error('Error in session refresh:', err));
    }, timeoutMs);
  };

  // Handle sign up with enhanced verification flow
  const signUp = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      const result = await signUpWithEmail(email, password, name, role);
      
      // Show success message
      toast.success(language === 'pt' 
        ? 'Registro bem-sucedido!' 
        : 'Registration successful!', {
        description: language === 'pt'
          ? 'Sua conta foi criada. Verifique seu email para confirmar.'
          : 'Your account has been created. Please check your email to confirm.'
      });
      
      return {
        success: true,
        user: result.user ? (typeof result.user === 'object' && 'role' in result.user 
          ? result.user as User 
          : null) : null,
        session: result.session
      };
    } catch (error) {
      const authError = handleAuthError(error, language === 'pt' ? 'registro' : 'registration');
      const errorMessage = getErrorMessage(authError, 'registration');
      
      toast.error(language === 'pt' ? 'Erro de registro' : 'Registration error', {
        description: errorMessage
      });
      
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [language, handleAuthError, getErrorMessage, setIsLoading]);

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

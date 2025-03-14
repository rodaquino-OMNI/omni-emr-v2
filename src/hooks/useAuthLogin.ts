
import { useState, useCallback } from 'react';
import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { signInWithProvider, signInWithEmail, signUpWithEmail } from '../utils/authUtils';
import { generateCSRFToken } from '../utils/csrfUtils';
import { toast } from 'sonner';

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

  // Handle social login
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

  // Handle sign up
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
    lastError,
  };
};

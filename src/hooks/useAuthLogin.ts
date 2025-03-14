
import { useState } from 'react';
import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { signInWithProvider, signInWithEmail, signUpWithEmail } from '../utils/authUtils';
import { generateCSRFToken } from '../utils/csrfUtils';
import { toast } from 'sonner';

export const useAuthLogin = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  handleLoginRateLimit: () => void,
  resetLoginAttempts: () => void,
  language: Language
) => {
  // Common error handler function to reduce duplication
  const handleAuthError = (error: any, context: string) => {
    console.error(`${context} error:`, error);
    
    const errorMessage = error?.message || 
      (language === 'pt' ? 'Erro de autenticação' : 'Authentication error');
      
    toast.error(
      language === 'pt' ? `Erro de ${context}` : `${context} error`, 
      { description: errorMessage }
    );
    
    throw error;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check rate limiting
      handleLoginRateLimit();
      
      console.log('Attempting login with email:', email);
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
    } catch (error) {
      handleAuthError(error, language === 'pt' ? 'login' : 'login');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: Provider) => {
    try {
      // Generate new CSRF token for the OAuth flow
      generateCSRFToken();
      await signInWithProvider(provider);
      // Auth state change listener will handle user/session updates
    } catch (error) {
      handleAuthError(error, language === 'pt' ? 'login social' : 'social login');
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole): Promise<{
    user: User | null;
    session: Session | null;
  }> => {
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
        user: result.user ? (typeof result.user === 'object' && 'role' in result.user 
          ? result.user as User 
          : null) : null,
        session: result.session
      };
    } catch (error: any) {
      // Handle specific Supabase errors
      let errorMessage = error.message || 
        (language === 'pt' ? 'Falha ao criar conta' : 'Failed to create account');
        
      if (error.message?.includes('User already registered')) {
        errorMessage = language === 'pt' 
          ? 'Este email já está registrado' 
          : 'This email is already registered';
      }
      
      toast.error(language === 'pt' ? 'Erro de registro' : 'Registration error', {
        description: errorMessage
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithSocial,
    signUp
  };
};

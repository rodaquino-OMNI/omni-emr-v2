
import { useState } from 'react';
import { Session, Provider } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { signInWithProvider, signInWithEmail, signUpWithEmail, mapSupabaseUserToUser } from '../utils/authUtils';
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
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check rate limiting
      handleLoginRateLimit();
      
      console.log('Attempting login with email:', email);
      const { user: authUser, session: authSession } = await signInWithEmail(email, password);
      console.log('Login response:', { authUser, authSession });
      
      if (authUser) {
        // For mock users, authUser will already be our User type
        if ('role' in authUser) {
          console.log('Setting mock user:', authUser);
          setUser(authUser as unknown as User);
        } else {
          // Need to await since mapSupabaseUserToUser returns a Promise<User>
          console.log('Mapping Supabase user to our User type');
          const mappedUser = await mapSupabaseUserToUser(authUser);
          console.log('Mapped user:', mappedUser);
          setUser(mappedUser);
        }
        
        setSession(authSession);
        
        // Reset login attempts on successful login
        resetLoginAttempts();
      } else {
        console.error('No user returned from login');
        throw new Error(language === 'pt' 
          ? 'Falha ao fazer login: Credenciais inválidas' 
          : 'Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error; // Let the component handle the error display
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: Provider) => {
    try {
      // Generate new CSRF token for the OAuth flow
      generateCSRFToken();
      
      await signInWithProvider(provider);
      // No need to set user or session here, the auth state change listener will handle it
    } catch (error) {
      console.error('Social login error:', error);
      
      // Display error to user
      toast.error(language === 'pt'
        ? 'Erro de login social'
        : 'Social login error', {
        description: language === 'pt' 
          ? `Não foi possível fazer login com ${provider}.`
          : `Could not sign in with ${provider}.`
      });
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      console.log('Starting signup process in useAuthLogin:', { email, name, role });
      const result = await signUpWithEmail(email, password, name, role);
      console.log('Signup result:', result);
      
      // Show success message
      toast.success(language === 'pt' 
        ? 'Registro bem-sucedido!' 
        : 'Registration successful!', {
        description: language === 'pt'
          ? 'Sua conta foi criada. Verifique seu email para confirmar.'
          : 'Your account has been created. Please check your email to confirm.'
      });
      
      return result;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = error.message || 
        (language === 'pt' ? 'Falha ao criar conta' : 'Failed to create account');
        
      // Handle specific Supabase errors
      if (error.message?.includes('User already registered')) {
        errorMessage = language === 'pt' 
          ? 'Este email já está registrado' 
          : 'This email is already registered';
      }
      
      // Show error to user via toast (component will also display the error)
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

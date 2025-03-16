
import { useCallback } from 'react';
import { toast } from 'sonner';
import { User, UserRole, Language } from '@/types/auth';
import { signUpWithEmail } from '@/utils/signUpUtils';
import { useAuthError } from './useAuthError';

export const useSignUpAuth = (
  setIsLoading: (isLoading: boolean) => void,
  language: Language
) => {
  const { handleAuthError, getErrorMessage } = useAuthError(language);

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
      
      // Convert Supabase user to our App User type if needed
      let appUser: User | null = null;
      
      if (result.user) {
        // Create our app's User type from Supabase User
        appUser = {
          id: result.user.id,
          email: result.user.email,
          name: name, // Use the name passed to the function
          role: role, // Use the role passed to the function
          status: 'active', // Default status for new users
          mfaEnabled: false,
          createdAt: result.user.created_at,
          lastLogin: new Date().toISOString()
        };
      }
      
      return {
        success: true,
        user: appUser,
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
    signUp
  };
};

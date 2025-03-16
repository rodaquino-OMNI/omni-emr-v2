
import { useCallback } from 'react';
import { toast } from 'sonner';
import { User, UserRole, Language } from '@/types/auth';
import { signUpWithEmail } from '@/utils/authUtils';
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
    signUp
  };
};

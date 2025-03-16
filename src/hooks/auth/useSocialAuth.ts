
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Provider, signInWithProvider } from '@/utils/auth/providerAuth';
import { Languages } from '@/types/auth';
import { generateCSRFToken } from '@/utils/csrfUtils';
import { useAuthError } from './useAuthError';

export const useSocialAuth = (language: Languages) => {
  const { handleAuthError, getErrorMessage } = useAuthError(language);

  // Handle social login with improved PKCE flow
  const loginWithSocial = useCallback(async (provider: Provider) => {
    try {
      // Generate new CSRF token for the OAuth flow
      generateCSRFToken();
      // Sign in with the provider
      const result = await signInWithProvider(provider);
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

  return {
    loginWithSocial
  };
};

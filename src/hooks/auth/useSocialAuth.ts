
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Provider } from '@supabase/supabase-js';
import { Language } from '@/types/auth';
import { signInWithProvider } from '@/utils/authUtils';
import { generateCSRFToken } from '@/utils/csrfUtils';
import { useAuthError } from './useAuthError';

export const useSocialAuth = (language: Language) => {
  const { handleAuthError, getErrorMessage } = useAuthError(language);

  // Handle social login with improved PKCE flow
  const loginWithSocial = useCallback(async (provider: Provider | string) => {
    try {
      // Generate new CSRF token for the OAuth flow
      generateCSRFToken();
      // Convert provider to Provider type if it's a string
      const providerValue = provider as Provider;
      await signInWithProvider(providerValue);
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

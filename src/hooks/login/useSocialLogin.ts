
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Language } from '@/types/auth';

export const useSocialLogin = (language: Language) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithSocial } = useAuth();

  const handleSocialLogin = useCallback(async (provider: 'google' | 'facebook' | 'twitter' | 'azure') => {
    try {
      setIsSubmitting(true);
      const result = await loginWithSocial(provider);
      if (!result.success && result.error) {
        throw result.error;
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(
        language === 'pt' ? "Erro" : "Error",
        {
          description: error.message || 
            (language === 'pt' 
              ? `Não foi possível fazer login com ${provider}` 
              : `Could not sign in with ${provider}`)
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [language, loginWithSocial]);

  return {
    isSubmitting,
    setIsSubmitting,
    handleSocialLogin
  };
};

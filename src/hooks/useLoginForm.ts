
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Provider } from '@supabase/supabase-js';
import { useAuth } from '@/context/AuthContext';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { loginWithSocial } = useAuth();
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);

  // Handle social login
  const handleSocialLogin = useCallback(async (provider: Provider | string) => {
    setIsSubmittingSocial(true);
    setSocialError(null);
    
    try {
      // Convert string providers to Provider type
      const providerValue = provider as Provider;
      
      const result = await loginWithSocial(providerValue);
      
      if (!result.success && result.error) {
        throw new Error(result.error.message || `Could not sign in with ${provider}`);
      }
      
      // No need to navigate here since the auth callback will handle the redirect
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      
      setSocialError(error.message || `Could not sign in with ${provider}`);
      
      toast.error(
        "Login Error",
        {
          description: error.message || `Could not sign in with ${provider}`
        }
      );
    } finally {
      setIsSubmittingSocial(false);
    }
  }, [loginWithSocial]);

  return {
    handleSocialLogin,
    isSubmittingSocial,
    socialError
  };
};

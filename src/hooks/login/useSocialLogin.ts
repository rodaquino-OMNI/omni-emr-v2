
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Provider, loginWithSocial } from '@/utils/auth/providerAuth';
import { Language } from '@/types/auth';

export const useSocialLogin = (language: Language) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = useCallback(async (provider: 'google' | 'facebook' | 'twitter' | 'azure'): Promise<void> => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await loginWithSocial(provider);
      
      if (result.success) {
        toast.success(
          language === 'pt' ? 'Login bem-sucedido' : 'Login successful',
          { description: language === 'pt' 
              ? 'Você foi conectado com sucesso' 
              : 'You have been successfully logged in'
          }
        );
        
        navigate('/sectors');
      } else if (result.error) {
        throw new Error(result.error.message || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Social login error:', error);
      
      setError(error.message || (language === 'pt' 
        ? 'Falha na autenticação social' 
        : 'Social authentication failed'));
      
      toast.error(
        language === 'pt' ? 'Erro de login' : 'Login error',
        { description: error.message || (language === 'pt' 
            ? 'Ocorreu um erro durante o login social' 
            : 'An error occurred during social login')
        }
      );
    } finally {
      setIsSubmitting(false);
    }
    
    return Promise.resolve();
  }, [navigate, language]);

  return {
    handleSocialLogin,
    isSubmitting,
    error
  };
};

export default useSocialLogin;

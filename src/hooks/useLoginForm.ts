
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { secureStorage } from '@/utils/secureStorage';
import { Language } from '@/types/auth';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const { login, loginWithSocial, language } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
    }
    
    if (!password) {
      errors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      toast.success(
        language === 'pt' ? "Bem-vindo" : "Welcome back",
        {
          description: language === 'pt' 
            ? "Login realizado com sucesso." 
            : "You have successfully logged in."
        }
      );
      
      // Redirect to the return URL if it exists, otherwise to dashboard
      const returnUrl = secureStorage.getItem<string>('returnUrl', '/dashboard');
      secureStorage.removeItem('returnUrl');
      navigate(returnUrl);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Display appropriate error message
      let errorMessage = error.message || (language === 'pt' 
        ? 'Credenciais inválidas' 
        : 'Invalid credentials');
      
      // If the error message contains "auth/too-many-requests", it's a rate limit error
      if (error.message && error.message.includes('many')) {
        errorMessage = language === 'pt'
          ? 'Muitas tentativas de login. Por favor, tente novamente mais tarde.'
          : 'Too many login attempts. Please try again later.';
      }
      
      toast.error(
        language === 'pt' ? "Erro de login" : "Login error",
        { description: errorMessage }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    try {
      setIsSubmitting(true);
      await loginWithSocial(provider);
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
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    validationErrors,
    setValidationErrors,
    handleSubmit,
    handleSocialLogin
  };
};

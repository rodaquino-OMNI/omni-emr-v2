
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { secureStorage } from '@/utils/secureStorage';
import { Language } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const { login, loginWithSocial, resetPassword, language } = useAuth();
  const navigate = useNavigate();

  // Listen for authentication changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User has been signed in, redirect to appropriate page
        const returnUrl = secureStorage.getItem<string>('returnUrl', '/dashboard');
        secureStorage.removeItem('returnUrl');
        navigate(returnUrl);
      }
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!forgotPassword) {
      // Only validate password in normal login mode
      if (!email.trim()) {
        errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
      }
      
      if (!password) {
        errors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
      } else if (password.length < 6) {
        errors.password = language === 'pt' 
          ? 'Senha deve ter pelo menos 6 caracteres' 
          : 'Password must be at least 6 characters';
      }
    } else {
      // In forgot password mode, only validate email
      if (!email.trim()) {
        errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
      }
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
      // If in forgot password mode, call password reset
      if (forgotPassword) {
        const { success } = await resetPassword(email);
        
        if (success) {
          toast.success(
            language === 'pt' ? "Email enviado" : "Email sent",
            {
              description: language === 'pt' 
                ? "Verifique seu email para instruções de recuperação de senha." 
                : "Check your email for password reset instructions."
            }
          );
        }
        return;
      }
      
      // Store captcha token if available
      if (captchaToken) {
        localStorage.setItem('captcha_token', captchaToken);
      }
      
      // Normal login flow
      const { success } = await login(email, password);
      
      if (success) {
        toast.success(
          language === 'pt' ? "Bem-vindo" : "Welcome back",
          {
            description: language === 'pt' 
              ? "Login realizado com sucesso." 
              : "You have successfully logged in."
          }
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Display appropriate error message
      let errorMessage = error.message || (language === 'pt' 
        ? 'Credenciais inválidas' 
        : 'Invalid credentials');
      
      // If the error message contains "auth/too-many-requests", it's a rate limit error
      if (error.message && (error.message.includes('many') || error.message.includes('rate'))) {
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

  // Handle forgot password toggle
  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    // Clear validation errors when switching modes
    setValidationErrors({});
  };

  // Handle captcha response
  const handleCaptchaResponse = (token: string) => {
    setCaptchaToken(token);
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
    handleSocialLogin,
    forgotPassword,
    toggleForgotPassword,
    handleCaptchaResponse
  };
};

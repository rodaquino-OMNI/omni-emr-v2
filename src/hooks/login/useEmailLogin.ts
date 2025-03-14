
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Language } from '@/types/auth';

export const useEmailLogin = (language: Language) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const { login, resetPassword } = useAuth();

  const toggleForgotPassword = useCallback(() => {
    setForgotPassword(!forgotPassword);
  }, [forgotPassword]);

  const handleEmailSubmit = useCallback(async (e: React.FormEvent, validateForm: () => boolean) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
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
      
      if (captchaToken) {
        localStorage.setItem('captcha_token', captchaToken);
      }
      
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
      
      let errorMessage = error.message || (language === 'pt' 
        ? 'Credenciais inválidas' 
        : 'Invalid credentials');
      
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
  }, [email, password, forgotPassword, captchaToken, language, login, resetPassword]);

  const handleCaptchaResponse = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    forgotPassword,
    toggleForgotPassword,
    isSubmitting,
    setIsSubmitting,
    handleEmailSubmit,
    handleCaptchaResponse
  };
};

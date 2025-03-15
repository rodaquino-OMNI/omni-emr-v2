
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Language } from '@/types/auth';

export const useEmailLogin = (language: Language) => {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  
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
        // Handle password reset request
        const result = await resetPassword(email);
        
        if (result.success) {
          toast.success(
            language === 'pt' ? 'Email enviado' : 'Email sent',
            { description: language === 'pt' 
                ? 'Verifique seu email para instruções de recuperação' 
                : 'Check your email for recovery instructions'
            }
          );
        }
      } else {
        // Handle login
        const result = await login(email, password);
        
        if (result.success) {
          if (result.pendingApproval) {
            // User account is pending approval
            setPendingApproval(true);
            
            // No need to navigate since pendingApproval will be handled in the login page
            return;
          }
          
          // Normal login success - navigate to dashboard
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, forgotPassword, login, resetPassword, navigate, language]);
  
  // Function to handle Google reCAPTCHA response
  const handleCaptchaResponse = useCallback((token: string) => {
    if (token) {
      window.localStorage.setItem('captcha_token', token);
    }
  }, []);
  
  return {
    email,
    setEmail,
    password,
    setPassword,
    forgotPassword,
    toggleForgotPassword,
    handleEmailSubmit,
    handleCaptchaResponse,
    isSubmitting,
    pendingApproval
  };
};

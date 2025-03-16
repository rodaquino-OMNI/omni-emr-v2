
import { useState, useCallback, useEffect } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  
  const toggleForgotPassword = useCallback(() => {
    setForgotPassword(!forgotPassword);
    setError(null);
  }, [forgotPassword]);
  
  const clearError = useCallback(() => {
    if (error) setError(null);
  }, [error]);
  
  // Clear error when email/password changes
  useEffect(() => {
    clearError();
  }, [email, password, clearError]);
  
  const handleEmailSubmit = useCallback(async (e: React.FormEvent, validateForm: () => boolean) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
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
        } else if (result.error) {
          throw result.error;
        }
      } else {
        // Handle login
        const result = await login(email, password);
        
        if (result.success) {
          if (result.pendingApproval) {
            // User account is pending approval
            setPendingApproval(true);
            
            toast.info(
              language === 'pt' ? 'Aprovação pendente' : 'Approval pending',
              { description: language === 'pt' 
                  ? 'Sua conta está aguardando aprovação de um administrador' 
                  : 'Your account is awaiting administrator approval'
              }
            );
            // No need to navigate since pendingApproval will be handled in the login page
            return;
          }
          
          // Normal login success - navigate to sector selection
          navigate('/sectors');
        } else if (result.error) {
          throw result.error;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Set error message
      setError(error.message || (language === 'pt' 
        ? 'Falha na autenticação' 
        : 'Authentication failed'));
      
      toast.error(
        language === 'pt' ? 'Erro de login' : 'Login error',
        { description: error.message || (language === 'pt' 
            ? 'Ocorreu um erro durante o login' 
            : 'An error occurred during login')
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, forgotPassword, login, resetPassword, navigate, language]);
  
  return {
    email,
    setEmail,
    password,
    setPassword,
    forgotPassword,
    toggleForgotPassword,
    handleEmailSubmit,
    isSubmitting,
    pendingApproval,
    error,
    clearError
  };
};

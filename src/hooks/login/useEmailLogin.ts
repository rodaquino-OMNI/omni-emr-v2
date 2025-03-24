
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Languages } from '@/types/auth';
import { useAuthRateLimiting } from '@/hooks/useAuthRateLimiting';

export const useEmailLogin = (language: Languages) => {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  const { 
    handleLoginRateLimit, 
    resetLoginAttempts, 
    isLockedOut, 
    getRemainingLockoutTime 
  } = useAuthRateLimiting(language);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingLockoutTime, setRemainingLockoutTime] = useState(0);
  
  // Update remaining lockout time
  useEffect(() => {
    if (isLockedOut()) {
      const interval = setInterval(() => {
        setRemainingLockoutTime(getRemainingLockoutTime());
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setRemainingLockoutTime(0);
    }
  }, [isLockedOut, getRemainingLockoutTime]);
  
  const toggleForgotPassword = useCallback(() => {
    setForgotPassword(!forgotPassword);
    setError(null);
  }, [forgotPassword]);
  
  const clearError = useCallback(() => {
    if (error) setError(null);
  }, [error]);
  
  useEffect(() => {
    clearError();
  }, [email, password, clearError]);
  
  const handleEmailSubmit = useCallback(async (e: React.FormEvent, validateForm: () => boolean): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return Promise.resolve();
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Check for rate limiting before attempting login
      if (!forgotPassword) {
        try {
          handleLoginRateLimit();
        } catch (error: any) {
          setError(error.message);
          setIsSubmitting(false);
          return Promise.resolve();
        }
      }
      
      if (forgotPassword) {
        const result = await resetPassword(email);
        
        if (result.success) {
          toast.success(
            language === 'pt' ? 'Email enviado' : 'Email sent',
            { description: language === 'pt' 
                ? 'Verifique seu email para instruções de recuperação' 
                : 'Check your email for recovery instructions'
            }
          );
        } else if (result && 'error' in result && result.error) {
          throw result.error;
        }
      } else {
        console.log('useEmailLogin: Attempting login with email:', email);
        const result = await login(email, password);
        console.log('useEmailLogin: Login result:', result);
        
        if (result.success) {
          console.log('useEmailLogin: Login successful');
          // Reset login attempts on successful login
          resetLoginAttempts();
          
          if (result.pendingApproval) {
            console.log('useEmailLogin: Account pending approval');
            setPendingApproval(true);
            
            toast.info(
              language === 'pt' ? 'Aprovação pendente' : 'Approval pending',
              { description: language === 'pt'
                  ? 'Sua conta está aguardando aprovação de um administrador'
                  : 'Your account is awaiting administrator approval'
              }
            );
            return Promise.resolve();
          }
          
          console.log('useEmailLogin: Redirecting to dashboard');
          // Redirect directly to dashboard instead of sectors
          navigate('/dashboard');
        } else if (result && 'error' in result) {
          console.error('useEmailLogin: Login error:', result.error);
          throw result.error;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
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

    return Promise.resolve();
  }, [email, password, forgotPassword, login, resetPassword, navigate, language, handleLoginRateLimit, resetLoginAttempts]);
  
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
    clearError,
    isLockedOut: isLockedOut(),
    resetLockout: resetLoginAttempts,
    remainingLockoutTime
  };
};

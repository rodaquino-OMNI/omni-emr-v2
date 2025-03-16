
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signInWithPhone, verifyPhoneOTP } from '@/utils/authUtils';
import { Language } from '@/types/auth';

export const usePhoneLogin = (language: Language) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [usePhoneLogin, setUsePhoneLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePhoneLogin = useCallback(() => {
    setUsePhoneLogin(!usePhoneLogin);
    setVerificationSent(false);
    setError(null);
  }, [usePhoneLogin]);

  const resetPhoneForm = useCallback(() => {
    setUsePhoneLogin(false);
    setVerificationSent(false);
    setPhone('');
    setVerificationCode('');
    setError(null);
  }, []);
  
  // Clear error when phone/code changes
  useEffect(() => {
    if (error) setError(null);
  }, [phone, verificationCode, error]);

  const handlePhoneSubmit = useCallback(async (e: React.FormEvent, validateForm: () => boolean): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return Promise.resolve();
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await signInWithPhone(phone);
      
      if (result && 'success' in result && result.success) {
        setVerificationSent(true);
        toast.success(
          language === 'pt' ? "Código enviado" : "Code sent",
          {
            description: language === 'pt' 
              ? "Um código de verificação foi enviado para seu telefone." 
              : "A verification code has been sent to your phone."
          }
        );
      } else if (result && 'user' in result && result.user) {
        toast.success(
          language === 'pt' ? "Login bem-sucedido" : "Login successful",
          {
            description: language === 'pt' 
              ? "Você foi conectado com sucesso." 
              : "You have been successfully logged in."
          }
        );
        
        // Navigate to sector selection on successful login
        navigate('/sectors');
      } else {
        throw new Error(language === 'pt' 
          ? "Falha ao enviar o código de verificação" 
          : "Failed to send verification code");
      }
    } catch (error: any) {
      console.error("Phone verification error:", error);
      
      // Set error message
      setError(error.message || (language === 'pt' 
        ? 'Falha na verificação' 
        : 'Verification failed'));
      
      toast.error(
        language === 'pt' ? "Erro de verificação" : "Verification error",
        { 
          description: error.message || (language === 'pt' 
            ? 'Não foi possível enviar o código de verificação' 
            : 'Could not send verification code')
        }
      );
    } finally {
      setIsSubmitting(false);
    }

    return Promise.resolve();
  }, [phone, language, navigate]);

  const handleVerifySubmit = useCallback(async (e: React.FormEvent, validateForm: () => boolean): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return Promise.resolve();
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await verifyPhoneOTP(phone, verificationCode);
      
      if (result && result.success && result.user && result.session) {
        toast.success(
          language === 'pt' ? "Verificação concluída" : "Verification completed",
          {
            description: language === 'pt' 
              ? "Código verificado com sucesso. Você está conectado." 
              : "Code verified successfully. You are now logged in."
          }
        );
        
        // Navigate to sector selection on successful login
        navigate('/sectors');
      } else {
        throw new Error(language === 'pt' 
          ? "Falha na verificação do código" 
          : "Failed to verify code");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      
      // Set error message
      setError(error.message || (language === 'pt' 
        ? 'Falha na verificação' 
        : 'Verification failed'));
      
      toast.error(
        language === 'pt' ? "Erro de verificação" : "Verification error",
        { 
          description: error.message || (language === 'pt' 
            ? 'Código inválido ou expirado' 
            : 'Invalid or expired code')
        }
      );
    } finally {
      setIsSubmitting(false);
    }

    return Promise.resolve();
  }, [phone, verificationCode, language, navigate]);

  return {
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    isSubmitting,
    verificationSent,
    usePhoneLogin,
    togglePhoneLogin,
    resetPhoneForm,
    handlePhoneSubmit,
    handleVerifySubmit,
    error
  };
};

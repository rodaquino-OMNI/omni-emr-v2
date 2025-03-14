
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { signInWithPhone, verifyPhoneOTP } from '@/utils/authUtils';
import { Language } from '@/types/auth';

export const usePhoneLogin = (language: Language) => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [usePhoneLogin, setUsePhoneLogin] = useState(false);

  const togglePhoneLogin = useCallback(() => {
    setUsePhoneLogin(!usePhoneLogin);
    setVerificationSent(false);
  }, [usePhoneLogin]);

  const resetPhoneForm = useCallback(() => {
    setUsePhoneLogin(false);
    setVerificationSent(false);
    setPhone('');
    setVerificationCode('');
  }, []);

  const handlePhoneSubmit = useCallback(async (e: React.FormEvent, validateForm: () => boolean) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
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
      } else {
        throw new Error(language === 'pt' 
          ? "Falha ao enviar o código de verificação" 
          : "Failed to send verification code");
      }
    } catch (error: any) {
      console.error("Phone verification error:", error);
      
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
  }, [phone, language]);

  const handleVerifySubmit = useCallback(async (e: React.FormEvent, validateForm: () => boolean) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
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
      } else {
        throw new Error(language === 'pt' 
          ? "Falha na verificação do código" 
          : "Failed to verify code");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      
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
  }, [phone, verificationCode, language]);

  return {
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    isSubmitting,
    setIsSubmitting,
    verificationSent,
    usePhoneLogin,
    togglePhoneLogin,
    resetPhoneForm,
    handlePhoneSubmit,
    handleVerifySubmit
  };
};

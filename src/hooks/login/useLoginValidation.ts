import { useState, useCallback } from 'react';
import { Language } from '@/types/auth';

export const useLoginValidation = (language: Language) => {
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateEmailPassword = useCallback((email: string, password: string, forgotPassword: boolean): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
    }
    
    if (!forgotPassword) {
      const isDemoAccount = email.toLowerCase().endsWith('@omnicare.com');
      
      if (!password) {
        errors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
      } else if (password.length < 6 && !isDemoAccount) {
        errors.password = language === 'pt' 
          ? 'Senha deve ter pelo menos 6 caracteres' 
          : 'Password must be at least 6 characters';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [language]);

  const validatePhone = useCallback((phone: string, verificationSent: boolean, verificationCode: string): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!verificationSent) {
      if (!phone.trim()) {
        errors.phone = language === 'pt' ? 'Telefone é obrigatório' : 'Phone is required';
      } else if (!/^\+[1-9]\d{1,14}$/.test(phone)) {
        errors.phone = language === 'pt' 
          ? 'Formato de telefone inválido. Use o formato internacional (+123...)' 
          : 'Invalid phone format. Use international format (+123...)';
      }
    } else {
      if (!verificationCode.trim()) {
        errors.code = language === 'pt' ? 'Código de verificação é obrigatório' : 'Verification code is required';
      } else if (!/^\d{6}$/.test(verificationCode)) {
        errors.code = language === 'pt' 
          ? 'Código de verificação deve ter 6 dígitos' 
          : 'Verification code must be 6 digits';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [language]);

  return {
    validationErrors,
    setValidationErrors,
    validateEmailPassword,
    validatePhone
  };
};

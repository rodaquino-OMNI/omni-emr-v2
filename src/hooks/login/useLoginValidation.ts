
import { useState, useCallback } from 'react';
import { Languages } from '@/types/auth';

export const useLoginValidation = (language: Languages) => {
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateEmailPassword = useCallback((email: string, password: string, forgotPassword: boolean): boolean => {
    console.log('Validating email and password:', { email, passwordLength: password?.length, forgotPassword });
    
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      console.log('Email is empty');
      errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('Email format is invalid');
      errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
    }
    
    if (!forgotPassword) {
      const isDemoAccount = email.toLowerCase().endsWith('@omnicare.com');
      console.log('Is demo account:', isDemoAccount);
      
      if (!password) {
        console.log('Password is empty');
        errors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
      } else if (password.length < 6 && !isDemoAccount) {
        console.log('Password is too short and not a demo account');
        errors.password = language === 'pt'
          ? 'Senha deve ter pelo menos 6 caracteres'
          : 'Password must be at least 6 characters';
      }
    }
    
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    console.log('Validation errors:', errors);
    console.log('Validation result:', isValid ? 'Valid' : 'Invalid');
    return isValid;
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

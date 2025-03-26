
import { useState, useCallback } from 'react';
import { Languages } from '@/types/auth';

export const useLoginValidation = (language: Languages) => {
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateEmailPassword = useCallback((email: string, password: string, forgotPassword: boolean): boolean => {
    console.log('Validating email and password:', { email, passwordLength: password?.length, forgotPassword });
    console.log('Current validation errors before validation:', validationErrors);
    
    // Create a new errors object instead of modifying the existing one
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
    
    // Use a functional update to ensure we're working with the latest state
    setValidationErrors(prevErrors => {
      console.log('Previous validation errors:', prevErrors);
      console.log('New validation errors:', errors);
      return errors; // Replace with new errors object instead of merging
    });
    
    const isValid = Object.keys(errors).length === 0;
    console.log('Validation result:', isValid ? 'Valid' : 'Invalid');
    return isValid;
  }, [language, validationErrors]);

  const validatePhone = useCallback((phone: string, verificationSent: boolean, verificationCode: string): boolean => {
    console.log('Validating phone:', { phone, verificationSent, verificationCode });
    console.log('Current validation errors before validation:', validationErrors);
    
    // Create a new errors object instead of modifying the existing one
    const errors: {[key: string]: string} = {};
    
    if (!verificationSent) {
      if (!phone.trim()) {
        console.log('Phone is empty');
        errors.phone = language === 'pt' ? 'Telefone é obrigatório' : 'Phone is required';
      } else if (!/^\+[1-9]\d{1,14}$/.test(phone)) {
        console.log('Phone format is invalid');
        errors.phone = language === 'pt'
          ? 'Formato de telefone inválido. Use o formato internacional (+123...)'
          : 'Invalid phone format. Use international format (+123...)';
      }
    } else {
      if (!verificationCode.trim()) {
        console.log('Verification code is empty');
        errors.code = language === 'pt' ? 'Código de verificação é obrigatório' : 'Verification code is required';
      } else if (!/^\d{6}$/.test(verificationCode)) {
        console.log('Verification code format is invalid');
        errors.code = language === 'pt'
          ? 'Código de verificação deve ter 6 dígitos'
          : 'Verification code must be 6 digits';
      }
    }
    
    // Use a functional update to ensure we're working with the latest state
    setValidationErrors(prevErrors => {
      console.log('Previous validation errors:', prevErrors);
      console.log('New validation errors:', errors);
      return errors; // Replace with new errors object instead of merging
    });
    
    const isValid = Object.keys(errors).length === 0;
    console.log('Validation result:', isValid ? 'Valid' : 'Invalid');
    return isValid;
  }, [language, validationErrors]);

  return {
    validationErrors,
    setValidationErrors,
    validateEmailPassword,
    validatePhone
  };
};

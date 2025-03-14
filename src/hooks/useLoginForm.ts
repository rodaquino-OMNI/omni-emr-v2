
import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmailLogin } from './login/useEmailLogin';
import { usePhoneLogin } from './login/usePhoneLogin';
import { useSocialLogin } from './login/useSocialLogin';
import { useLoginValidation } from './login/useLoginValidation';

export const useLoginForm = () => {
  const { language } = useAuth();
  
  // Use the smaller, focused hooks
  const {
    validationErrors,
    setValidationErrors,
    validateEmailPassword,
    validatePhone
  } = useLoginValidation(language);
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    forgotPassword,
    toggleForgotPassword,
    handleEmailSubmit,
    handleCaptchaResponse
  } = useEmailLogin(language);
  
  const {
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    verificationSent,
    usePhoneLogin,
    togglePhoneLogin,
    resetPhoneForm,
    handlePhoneSubmit,
    handleVerifySubmit
  } = usePhoneLogin(language);
  
  const { handleSocialLogin } = useSocialLogin(language);
  
  // Combined validation function that delegates to the appropriate validator
  const validateForm = useCallback((): boolean => {
    if (usePhoneLogin) {
      return validatePhone(phone, verificationSent, verificationCode);
    } else {
      return validateEmailPassword(email, password, forgotPassword);
    }
  }, [
    usePhoneLogin, 
    validatePhone, 
    phone, 
    verificationSent, 
    verificationCode, 
    validateEmailPassword, 
    email, 
    password, 
    forgotPassword
  ]);
  
  // Wrapper functions to handle form submissions with validation
  const handleSubmit = useCallback((e: React.FormEvent) => {
    return handleEmailSubmit(e, validateForm);
  }, [handleEmailSubmit, validateForm]);
  
  const handlePhoneFormSubmit = useCallback((e: React.FormEvent) => {
    return handlePhoneSubmit(e, validateForm);
  }, [handlePhoneSubmit, validateForm]);
  
  const handleVerifyFormSubmit = useCallback((e: React.FormEvent) => {
    return handleVerifySubmit(e, validateForm);
  }, [handleVerifySubmit, validateForm]);
  
  // Function to reset everything
  const resetForm = useCallback(() => {
    resetPhoneForm();
    setValidationErrors({});
  }, [resetPhoneForm, setValidationErrors]);
  
  // Combine and return all the necessary properties and methods
  return {
    // Email login related
    email,
    setEmail,
    password,
    setPassword,
    
    // Phone login related
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    verificationSent,
    
    // UI state
    isSubmitting: usePhoneLogin ? usePhoneLogin.isSubmitting : useEmailLogin.isSubmitting,
    validationErrors,
    setValidationErrors,
    
    // Form handlers
    handleSubmit,
    handlePhoneSubmit: handlePhoneFormSubmit,
    handleVerifySubmit: handleVerifyFormSubmit,
    handleSocialLogin,
    
    // Toggle state
    forgotPassword,
    toggleForgotPassword,
    usePhoneLogin,
    togglePhoneLogin,
    
    // Utilities
    resetForm,
    handleCaptchaResponse
  };
};

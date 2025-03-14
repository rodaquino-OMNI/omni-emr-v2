
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
    handleCaptchaResponse,
    isSubmitting: emailIsSubmitting
  } = useEmailLogin(language);
  
  const {
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    verificationSent,
    usePhoneLogin: phoneLoginEnabled,
    togglePhoneLogin,
    resetPhoneForm,
    handlePhoneSubmit,
    handleVerifySubmit,
    isSubmitting: phoneIsSubmitting
  } = usePhoneLogin(language);
  
  const { handleSocialLogin, isSubmitting: socialIsSubmitting } = useSocialLogin(language);
  
  // Combined validation function that delegates to the appropriate validator
  const validateForm = useCallback((): boolean => {
    if (phoneLoginEnabled) {
      return validatePhone(phone, verificationSent, verificationCode);
    } else {
      return validateEmailPassword(email, password, forgotPassword);
    }
  }, [
    phoneLoginEnabled, 
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
  
  // Determine the current isSubmitting state based on which login method is active
  const isSubmitting = phoneLoginEnabled ? phoneIsSubmitting : emailIsSubmitting;
  
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
    isSubmitting,
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
    usePhoneLogin: phoneLoginEnabled,
    togglePhoneLogin,
    
    // Utilities
    resetForm,
    handleCaptchaResponse
  };
};

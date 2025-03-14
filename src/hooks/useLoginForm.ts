import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { secureStorage } from '@/utils/secureStorage';
import { Language } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { signInWithPhone, verifyPhoneOTP } from '@/utils/authUtils';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const [usePhoneLogin, setUsePhoneLogin] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const { login, loginWithSocial, resetPassword, language } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const returnUrl = secureStorage.getItem<string>('returnUrl', '/dashboard');
        secureStorage.removeItem('returnUrl');
        navigate(returnUrl);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (usePhoneLogin) {
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
    } else if (!forgotPassword) {
      if (!email.trim()) {
        errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
      }
      
      if (!password) {
        errors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
      } else if (password.length < 6) {
        errors.password = language === 'pt' 
          ? 'Senha deve ter pelo menos 6 caracteres' 
          : 'Password must be at least 6 characters';
      }
    } else {
      if (!email.trim()) {
        errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (forgotPassword) {
        const { success } = await resetPassword(email);
        
        if (success) {
          toast.success(
            language === 'pt' ? "Email enviado" : "Email sent",
            {
              description: language === 'pt' 
                ? "Verifique seu email para instruções de recuperação de senha." 
                : "Check your email for password reset instructions."
            }
          );
        }
        return;
      }
      
      if (captchaToken) {
        localStorage.setItem('captcha_token', captchaToken);
      }
      
      const { success } = await login(email, password);
      
      if (success) {
        toast.success(
          language === 'pt' ? "Bem-vindo" : "Welcome back",
          {
            description: language === 'pt' 
              ? "Login realizado com sucesso." 
              : "You have successfully logged in."
          }
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = error.message || (language === 'pt' 
        ? 'Credenciais inválidas' 
        : 'Invalid credentials');
      
      if (error.message && (error.message.includes('many') || error.message.includes('rate'))) {
        errorMessage = language === 'pt'
          ? 'Muitas tentativas de login. Por favor, tente novamente mais tarde.'
          : 'Too many login attempts. Please try again later.';
      }
      
      toast.error(
        language === 'pt' ? "Erro de login" : "Login error",
        { description: errorMessage }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await signInWithPhone(phone);
      
      if ('data' in result && result.success) {
        setVerificationSent(true);
        toast.success(
          language === 'pt' ? "Código enviado" : "Code sent",
          {
            description: language === 'pt' 
              ? "Um código de verificação foi enviado para seu telefone." 
              : "A verification code has been sent to your phone."
          }
        );
      } else if ('user' in result && result.user) {
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
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { user, session } = await verifyPhoneOTP(phone, verificationCode);
      
      if (user && session) {
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
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter' | 'github' | 'azure') => {
    try {
      setIsSubmitting(true);
      await loginWithSocial(provider);
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(
        language === 'pt' ? "Erro" : "Error",
        {
          description: error.message || 
            (language === 'pt' 
              ? `Não foi possível fazer login com ${provider}` 
              : `Could not sign in with ${provider}`)
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    setUsePhoneLogin(false);
    setValidationErrors({});
  };

  const togglePhoneLogin = () => {
    setUsePhoneLogin(!usePhoneLogin);
    setForgotPassword(false);
    setVerificationSent(false);
    setValidationErrors({});
  };

  const resetForm = () => {
    setUsePhoneLogin(false);
    setForgotPassword(false);
    setVerificationSent(false);
    setPhone('');
    setVerificationCode('');
    setValidationErrors({});
  };

  const handleCaptchaResponse = (token: string) => {
    setCaptchaToken(token);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    verificationCode,
    setVerificationCode,
    isSubmitting,
    validationErrors,
    setValidationErrors,
    handleSubmit,
    handlePhoneSubmit,
    handleVerifySubmit,
    handleSocialLogin,
    forgotPassword,
    toggleForgotPassword,
    usePhoneLogin,
    togglePhoneLogin,
    verificationSent,
    resetForm,
    handleCaptchaResponse
  };
};

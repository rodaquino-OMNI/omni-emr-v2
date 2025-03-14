
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Language } from '@/types/auth';
import { useLoginForm } from '@/hooks/useLoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import EmailLoginForm from '@/components/auth/EmailLoginForm';
import PhoneLoginForm from '@/components/auth/PhoneLoginForm';
import { Phone, Mail } from 'lucide-react';

interface LoginCardProps {
  t: (key: string) => string;
  language: Language;
  isSupabaseConnected: boolean | null;
}

const LoginCard = ({ t, language, isSupabaseConnected }: LoginCardProps) => {
  const {
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
    resetForm
  } = useLoginForm();
  
  return (
    <>
      {!forgotPassword && !usePhoneLogin && (
        <>
          <SocialLoginButtons 
            isSubmitting={isSubmitting}
            handleSocialLogin={handleSocialLogin}
            isSupabaseConnected={isSupabaseConnected}
          />

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {language === 'pt' ? 'Ou continue com' : 'Or continue with'}
              </span>
            </div>
          </div>
        </>
      )}
      
      {/* Toggle between email and phone login */}
      {!forgotPassword && (
        <LoginMethodSelector 
          usePhoneLogin={usePhoneLogin}
          togglePhoneLogin={togglePhoneLogin}
          isSubmitting={isSubmitting}
          language={language}
        />
      )}
      
      {usePhoneLogin ? (
        <PhoneLoginForm
          phone={phone}
          setPhone={setPhone}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handlePhoneSubmit={handlePhoneSubmit}
          handleVerifySubmit={handleVerifySubmit}
          isSubmitting={isSubmitting}
          verificationSent={verificationSent}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          language={language}
          t={t}
          resetForm={resetForm}
        />
      ) : (
        <EmailLoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          language={language}
          t={t}
          forgotPassword={forgotPassword}
          toggleForgotPassword={toggleForgotPassword}
        />
      )}
    </>
  );
};

// Login method selector component
interface LoginMethodSelectorProps {
  usePhoneLogin: boolean;
  togglePhoneLogin: () => void;
  isSubmitting: boolean;
  language: Language;
}

const LoginMethodSelector = ({ 
  usePhoneLogin, 
  togglePhoneLogin, 
  isSubmitting, 
  language 
}: LoginMethodSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        type="button"
        variant={usePhoneLogin ? "outline" : "default"}
        className="flex-1"
        onClick={() => usePhoneLogin && togglePhoneLogin()}
        disabled={isSubmitting || !usePhoneLogin}
      >
        <Mail className="h-4 w-4 mr-2" />
        {language === 'pt' ? 'Email' : 'Email'}
      </Button>
      <Button
        type="button"
        variant={usePhoneLogin ? "default" : "outline"}
        className="flex-1"
        onClick={() => !usePhoneLogin && togglePhoneLogin()}
        disabled={isSubmitting || usePhoneLogin}
      >
        <Phone className="h-4 w-4 mr-2" />
        {language === 'pt' ? 'Telefone' : 'Phone'}
      </Button>
    </div>
  );
};

export default LoginCard;

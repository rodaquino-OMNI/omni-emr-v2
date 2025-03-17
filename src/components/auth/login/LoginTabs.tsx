
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from '../EmailLoginForm';
import PhoneLoginForm from '../PhoneLoginForm';
import SocialLoginButtons from '../SocialLoginButtons';
import { Languages } from '@/types/auth';

interface ValidationErrors {
  [key: string]: string;
}

interface LoginTabsProps {
  activeView: 'email' | 'phone' | 'social';
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleEmailFormSubmit: (e: React.FormEvent) => Promise<void>;
  isEmailSubmitting: boolean;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors | ((prev: ValidationErrors) => ValidationErrors)) => void;
  language: Languages;
  t: (key: string) => string;
  forgotPassword: boolean;
  toggleForgotPassword: () => void;
  
  phone: string;
  setPhone: (phone: string) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  handlePhoneFormSubmit: (e: React.FormEvent) => Promise<void>;
  handleVerifyFormSubmit: (e: React.FormEvent) => Promise<void>;
  clearEmailError: () => void;
  isPhoneSubmitting: boolean;
  verificationSent: boolean;
  resetPhoneForm: () => void;
  
  handleSocialLogin: (provider: 'google' | 'facebook' | 'twitter' | 'azure') => void;
  isSocialSubmitting: boolean;
  isSupabaseConnected: boolean;
  
  isLockedOut?: boolean;
  resetLockout?: () => void;
  remainingLockoutTime?: number;
}

const LoginTabs: React.FC<LoginTabsProps> = ({
  activeView,
  email,
  setEmail,
  password,
  setPassword,
  handleEmailFormSubmit,
  isEmailSubmitting,
  validationErrors,
  setValidationErrors,
  language,
  t,
  forgotPassword,
  toggleForgotPassword,
  
  phone,
  setPhone,
  verificationCode,
  setVerificationCode,
  handlePhoneFormSubmit,
  handleVerifyFormSubmit,
  clearEmailError,
  isPhoneSubmitting,
  verificationSent,
  resetPhoneForm,
  
  handleSocialLogin,
  isSocialSubmitting,
  isSupabaseConnected,
  
  isLockedOut = false,
  resetLockout,
  remainingLockoutTime = 0
}) => {
  return (
    <Tabs defaultValue={activeView} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="email" onClick={clearEmailError}>
          {language === 'pt' ? 'Email' : 'Email'}
        </TabsTrigger>
        <TabsTrigger value="phone" onClick={clearEmailError}>
          {language === 'pt' ? 'Telefone' : 'Phone'}
        </TabsTrigger>
        <TabsTrigger value="social" onClick={clearEmailError}>
          {language === 'pt' ? 'Social' : 'Social'}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="email">
        <EmailLoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleEmailFormSubmit}
          isSubmitting={isEmailSubmitting}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          language={language}
          t={t}
          forgotPassword={forgotPassword}
          toggleForgotPassword={toggleForgotPassword}
          isLockedOut={isLockedOut}
          resetLockout={resetLockout}
          remainingLockoutTime={remainingLockoutTime}
        />
      </TabsContent>
      
      <TabsContent value="phone">
        <PhoneLoginForm 
          phone={phone}
          setPhone={setPhone}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handlePhoneFormSubmit={handlePhoneFormSubmit}
          handleVerifyFormSubmit={handleVerifyFormSubmit}
          isSubmitting={isPhoneSubmitting}
          verificationSent={verificationSent}
          resetForm={resetPhoneForm}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          language={language}
        />
      </TabsContent>
      
      <TabsContent value="social">
        <SocialLoginButtons
          onLogin={handleSocialLogin}
          isLoading={isSocialSubmitting}
          language={language}
          isSupabaseConnected={isSupabaseConnected}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LoginTabs;

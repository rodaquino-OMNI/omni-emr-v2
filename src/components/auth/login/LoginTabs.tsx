
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Languages } from '@/types/auth';
import EmailLoginForm from '../EmailLoginForm';
import PhoneLoginForm from '../PhoneLoginForm';
import SocialLoginButtons from '../SocialLoginButtons';
import { LoginView } from './LoginHeader';

interface LoginTabsProps {
  activeView: LoginView;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleEmailFormSubmit: (e: React.FormEvent) => Promise<void>;
  isEmailSubmitting: boolean;
  validationErrors: { [key: string]: string };
  setValidationErrors: (errors: { [key: string]: string } | ((prev: any) => any)) => void;
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
  
  handleSocialLogin: (provider: 'google' | 'facebook' | 'twitter' | 'azure') => Promise<void>;
  isSocialSubmitting: boolean;
  isSupabaseConnected: boolean;
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
  isSupabaseConnected
}) => {
  return (
    <Tabs value={activeView} className="w-full">
      <TabsContent value="email" className="mt-0">
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
        />
      </TabsContent>
      
      <TabsContent value="phone" className="mt-0">
        <PhoneLoginForm 
          phone={phone}
          setPhone={setPhone}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handlePhoneSubmit={handlePhoneFormSubmit}
          handleVerifySubmit={handleVerifyFormSubmit}
          handleClearError={clearEmailError}
          isSubmitting={isPhoneSubmitting}
          verificationSent={verificationSent}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          language={language}
          t={t}
          resetForm={resetPhoneForm}
        />
      </TabsContent>
      
      <TabsContent value="social" className="mt-0">
        <SocialLoginButtons 
          isSubmitting={isSocialSubmitting}
          handleSocialLogin={handleSocialLogin}
          isSupabaseConnected={isSupabaseConnected}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LoginTabs;

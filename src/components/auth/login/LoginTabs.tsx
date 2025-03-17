
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from '../EmailLoginForm';
import PhoneLoginForm from '../PhoneLoginForm';
import SocialLoginButtons from '../SocialLoginButtons';
import { Languages } from '@/types/auth';
import { Mail, Phone, Users } from 'lucide-react';

interface ValidationErrors {
  [key: string]: string;
}

interface LoginTabsProps {
  activeView: 'email' | 'phone' | 'social';
  setActiveView?: (view: 'email' | 'phone' | 'social') => void;
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
  setActiveView,
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
  const handleTabChange = (value: string) => {
    if (setActiveView) {
      setActiveView(value as 'email' | 'phone' | 'social');
    }
    if (clearEmailError) {
      clearEmailError();
    }
  };

  return (
    <Tabs value={activeView} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6 bg-background/10 p-1 rounded-lg">
        <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground">
          <Mail className="h-4 w-4" />
          {language === 'pt' ? 'Email' : 'Email'}
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex items-center gap-2 data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground">
          <Phone className="h-4 w-4" />
          {language === 'pt' ? 'Telefone' : 'Phone'}
        </TabsTrigger>
        <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground">
          <Users className="h-4 w-4" />
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
      
      <TabsContent value="social">
        <SocialLoginButtons
          handleSocialLogin={handleSocialLogin}
          isLoading={isSocialSubmitting}
          language={language}
          isSupabaseConnected={isSupabaseConnected}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LoginTabs;


import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';

import LoginTabs from './LoginTabs';
import LoginErrorAlert from './LoginErrorAlert';
import ConnectionAlert from './ConnectionAlert';
import ApprovalPendingAlert from './ApprovalPendingAlert';
import LoginHeader from './LoginHeader';

const LoginCard: React.FC = () => {
  const { login, loginWithSocial, user, session, isLoading } = useAuth();
  const { language, t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeView, setActiveView] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);
  const [pendingApproval, setPendingApproval] = useState(false);
  
  // Helper function to clear errors
  const clearError = () => {
    setError(null);
    setValidationErrors({});
  };
  
  useEffect(() => {
    if (user) {
      // Navigate to sectors
      navigate('/sectors');
    }
  }, [user, navigate]);
  
  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSubmitting(true);
    clearError();
    setValidationErrors({});
    
    if (!email) {
      setValidationErrors(prev => ({ ...prev, email: t('emailRequired', 'Email is required') }));
      setIsEmailSubmitting(false);
      return;
    }
    
    if (!password) {
      setValidationErrors(prev => ({ ...prev, password: t('passwordRequired', 'Password is required') }));
      setIsEmailSubmitting(false);
      return;
    }
    
    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Error signing in:", err);
      setError(err.message || "Failed to sign in");
      setValidationErrors({});
    } finally {
      setIsEmailSubmitting(false);
    }
  };
  
  const handlePhoneFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneSubmitting(true);
    clearError();
    setValidationErrors({});
    
    if (!phone) {
      setValidationErrors(prev => ({ ...prev, phone: t('phoneRequired', 'Phone number is required') }));
      setIsPhoneSubmitting(false);
      return;
    }
    
    try {
      // This would be implemented if phone auth is supported
      setVerificationSent(true);
    } catch (err: any) {
      console.error("Error sending verification code:", err);
      setError(err.message || "Failed to send verification code");
      setValidationErrors({});
    } finally {
      setIsPhoneSubmitting(false);
    }
  };
  
  const handleVerifyFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneSubmitting(true);
    clearError();
    setValidationErrors({});
    
    if (!verificationCode) {
      setValidationErrors(prev => ({ ...prev, verificationCode: t('verificationCodeRequired', 'Verification code is required') }));
      setIsPhoneSubmitting(false);
      return;
    }
    
    try {
      // This would be implemented if phone auth is supported
      console.log("Verifying code:", verificationCode);
    } catch (err: any) {
      console.error("Error verifying phone number:", err);
      setError(err.message || "Failed to verify code");
      setValidationErrors({});
    } finally {
      setIsPhoneSubmitting(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter' | 'azure') => {
    setIsSocialSubmitting(true);
    clearError();
    try {
      await loginWithSocial(provider);
    } catch (err: any) {
      console.error(`Error signing in with ${provider}:`, err);
      setError(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setIsSocialSubmitting(false);
    }
  };
  
  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
  };
  
  const resetPhoneForm = () => {
    setVerificationSent(false);
    setPhone('');
    setVerificationCode('');
  };
  
  return (
    <Card className="w-[380px] shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t('login', 'Login')}</CardTitle>
        <CardDescription>{t('enterCredentials', 'Enter your credentials to continue')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <LoginErrorAlert error={error} language={language} />
        <ConnectionAlert isSupabaseConnected={isSupabaseConnected} language={language} />
        <ApprovalPendingAlert pendingApproval={pendingApproval} language={language} />
        
        <LoginTabs 
          activeView={activeView}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleEmailFormSubmit={handleEmailFormSubmit}
          isEmailSubmitting={isEmailSubmitting}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          language={language}
          t={t}
          forgotPassword={forgotPassword}
          toggleForgotPassword={toggleForgotPassword}
          
          phone={phone}
          setPhone={setPhone}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handlePhoneFormSubmit={handlePhoneFormSubmit}
          handleVerifyFormSubmit={handleVerifyFormSubmit}
          clearEmailError={clearError}
          isPhoneSubmitting={isPhoneSubmitting}
          verificationSent={verificationSent}
          resetPhoneForm={resetPhoneForm}
          
          handleSocialLogin={handleSocialLogin}
          isSocialSubmitting={isSocialSubmitting}
          isSupabaseConnected={isSupabaseConnected}
        />
        
        <LoginHeader 
          activeView={activeView} 
          setActiveView={setActiveView} 
          t={t} 
          language={language} 
        />
      </CardContent>
    </Card>
  );
};

export default LoginCard;

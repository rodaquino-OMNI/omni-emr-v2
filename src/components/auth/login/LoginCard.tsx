import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Languages } from '@/constants/language';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from '@/components/ui/icons';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom';
import { 
  canAccessPage, 
  getAvailableFunctionBlocks, 
  getPermissionsFromFunctionBlocks 
} from '@/utils/functionBlocks';
import { UserRole } from '@/types/auth';

import LoginTabs from './LoginTabs';
import LoginErrorAlert from './LoginErrorAlert';
import ConnectionAlert from './ConnectionAlert';
import ApprovalPendingAlert from './ApprovalPendingAlert';
import LoginHeader, { LoginView } from './LoginHeader';

const LoginCard: React.FC = () => {
  const { signInWithEmail, signInWithPhone, signInWithGoogle, signInWithFacebook, 
          signInWithTwitter, signInWithAzure, user, error, isSupabaseConnected, 
          pendingApproval, clearError, functionBlocks } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [activeView, setActiveView] = useState<LoginView>('email');
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
  
  const language = i18n.language as Languages;
  
  useEffect(() => {
    if (user) {
      // Get available function blocks for the user's role
      const availableBlocks = getAvailableFunctionBlocks(functionBlocks, user.role);
      
      // Get permissions from function blocks
      const permissions = getPermissionsFromFunctionBlocks(functionBlocks, user.role);
      
      // Update user context with function blocks and permissions
      user.functionBlocks = availableBlocks;
      user.permissions = permissions;
      
      // Check if the user can access the dashboard page
      if (canAccessPage(functionBlocks, '/dashboard', user.role)) {
        navigate('/dashboard');
      } else {
        // If not, navigate to the unauthorized page
        navigate('/unauthorized');
      }
    }
  }, [user, navigate, functionBlocks]);
  
  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSubmitting(true);
    clearError();
    setValidationErrors({});
    
    if (!email) {
      setValidationErrors(prev => ({ ...prev, email: t('emailRequired') }));
      setIsEmailSubmitting(false);
      return;
    }
    
    if (!password) {
      setValidationErrors(prev => ({ ...prev, password: t('passwordRequired') }));
      setIsEmailSubmitting(false);
      return;
    }
    
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error("Error signing in:", err);
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
      setValidationErrors(prev => ({ ...prev, phone: t('phoneRequired') }));
      setIsPhoneSubmitting(false);
      return;
    }
    
    try {
      await signInWithPhone(phone);
      setVerificationSent(true);
    } catch (err: any) {
      console.error("Error sending verification code:", err);
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
      setValidationErrors(prev => ({ ...prev, verificationCode: t('verificationCodeRequired') }));
      setIsPhoneSubmitting(false);
      return;
    }
    
    try {
      await signInWithPhone(phone, verificationCode);
    } catch (err: any) {
      console.error("Error verifying phone number:", err);
      setValidationErrors({});
    } finally {
      setIsPhoneSubmitting(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter' | 'azure') => {
    setIsSocialSubmitting(true);
    clearError();
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
        case 'twitter':
          await signInWithTwitter();
          break;
        case 'azure':
          await signInWithAzure();
          break;
        default:
          console.error('Unsupported provider');
      }
    } catch (err: any) {
      console.error(`Error signing in with ${provider}:`, err);
    } finally {
      setIsSocialSubmitting(false);
    }
  };
  
  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
  };
  
  const clearEmailError = () => {
    clearError();
    setValidationErrors({});
  };
  
  const resetPhoneForm = () => {
    setVerificationSent(false);
    setPhone('');
    setVerificationCode('');
  };
  
  return (
    <Card className="w-[380px] shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t('login')}</CardTitle>
        <CardDescription>{t('enterCredentials')}</CardDescription>
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
          clearEmailError={clearEmailError}
          isPhoneSubmitting={isPhoneSubmitting}
          verificationSent={verificationSent}
          resetPhoneForm={resetPhoneForm}
          
          handleSocialLogin={handleSocialLogin}
          isSocialSubmitting={isSocialSubmitting}
          isSupabaseConnected={isSupabaseConnected}
        />
        
        <LoginHeader activeView={activeView} setActiveView={setActiveView} />
      </CardContent>
    </Card>
  );
};

export default LoginCard;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCheck, Loader2, KeyRound, ArrowLeft, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Languages } from '@/types/auth';

interface ValidationErrors {
  [key: string]: string;
}

interface EmailLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors | ((prev: ValidationErrors) => ValidationErrors)) => void;
  language: Languages;
  t: (key: string) => string;
  forgotPassword?: boolean;
  toggleForgotPassword?: () => void;
  isLockedOut?: boolean;
  resetLockout?: () => void;
  remainingLockoutTime?: number;
}

const EmailLoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isSubmitting,
  validationErrors,
  setValidationErrors,
  language,
  t,
  forgotPassword = false,
  toggleForgotPassword,
  isLockedOut = false,
  resetLockout,
  remainingLockoutTime = 0
}: EmailLoginFormProps) => {
  const [showDemoCredentials, setShowDemoCredentials] = useState<boolean>(false);
  
  // Add debugging to track component re-renders and prop changes
  React.useEffect(() => {
    console.log('EmailLoginForm: Component rendered with props', {
      email,
      password: password ? '(password provided)' : '(no password)',
      validationErrors: JSON.stringify(validationErrors),
      forgotPassword,
      isSubmitting,
      isLockedOut
    });
  });

  const toggleDemoCredentials = () => {
    setShowDemoCredentials(!showDemoCredentials);
  };

  // Format remaining lockout time
  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSecs}s`;
    }
    return `${seconds}s`;
  };

  return (
    <form onSubmit={(e) => {
      console.log('EmailLoginForm: Form submitted');
      console.log('EmailLoginForm: Form state before submit:', {
        email,
        password: password ? '(password provided)' : '(no password)',
        validationErrors: JSON.stringify(validationErrors)
      });
      handleSubmit(e);
    }} className="space-y-4">
      {isLockedOut && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          <div className="flex justify-between items-center">
            <div>
              {language === 'pt' 
                ? `Conta bloqueada temporariamente. Tente novamente em ${formatRemainingTime(remainingLockoutTime)}.` 
                : `Account temporarily locked. Try again in ${formatRemainingTime(remainingLockoutTime)}.`}
            </div>
            {resetLockout && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                className="h-7 flex items-center gap-1"
                onClick={resetLockout}
              >
                <RefreshCw className="h-3 w-3" />
                {language === 'pt' ? 'Redefinir' : 'Reset'}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('email')}
        </label>
        <Input
          id="email"
          type="email"
          className={`w-full h-11 px-3 rounded-md ${
            validationErrors.email ? 'border-destructive' : 'border-input'
          }`}
          value={email}
          onChange={(e) => {
            console.log('Email input changed:', e.target.value);
            // Only update email state, don't touch validation errors yet
            setEmail(e.target.value);
            
            // Create a separate function to handle validation errors
            // This prevents race conditions and isolates the state update
            if (validationErrors.email) {
              console.log('Clearing email validation error');
              // Create a new object instead of spreading to avoid reference issues
              const newValidationErrors = Object.assign({}, validationErrors);
              newValidationErrors.email = '';
              setValidationErrors(newValidationErrors);
            }
          }}
          disabled={isSubmitting || isLockedOut}
          placeholder="admin@omnicare.com"
          autoComplete="email"
        />
        {validationErrors.email && (
          <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
        )}
      </div>
      
      {!forgotPassword && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium">
              {t('password')}
            </label>
            {toggleForgotPassword && (
              <button 
                type="button" 
                onClick={toggleForgotPassword}
                className="text-xs text-primary hover:underline"
                disabled={isLockedOut}
              >
                {language === 'pt' ? 'Esqueceu a senha?' : 'Forgot password?'}
              </button>
            )}
          </div>
          <Input
            id="password"
            type="password"
            className={`w-full h-11 px-3 rounded-md ${
              validationErrors.password ? 'border-destructive' : 'border-input'
            }`}
            value={password}
            onChange={(e) => {
              console.log('Password input changed:', e.target.value.length > 0 ? '(password provided)' : '(no password)');
              // Only update password state, don't touch validation errors yet
              setPassword(e.target.value);
              
              // Create a separate function to handle validation errors
              // This prevents race conditions and isolates the state update
              if (validationErrors.password) {
                console.log('Clearing password validation error');
                // Create a new object instead of spreading to avoid reference issues
                const newValidationErrors = Object.assign({}, validationErrors);
                newValidationErrors.password = '';
                setValidationErrors(newValidationErrors);
              }
            }}
            disabled={isSubmitting || isLockedOut}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {validationErrors.password && (
            <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>
          )}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full h-11 bg-primary hover:bg-primary/90 flex items-center justify-center" 
        disabled={isSubmitting || isLockedOut}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {forgotPassword 
              ? (language === 'pt' ? 'Enviando...' : 'Sending...') 
              : (language === 'pt' ? 'Entrando...' : 'Signing in...')}
          </>
        ) : (
          <>
            {forgotPassword 
              ? (<><KeyRound className="h-4 w-4 mr-2" />{language === 'pt' ? 'Enviar link de recuperação' : 'Send recovery link'}</>)
              : (<><UserCheck className="h-4 w-4 mr-2" />{t('signIn')}</>)
            }
          </>
        )}
      </Button>
      
      {forgotPassword && toggleForgotPassword && (
        <button
          type="button"
          onClick={toggleForgotPassword}
          className="w-full mt-2 text-sm text-center flex items-center justify-center text-muted-foreground hover:text-primary"
          disabled={isLockedOut}
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          {language === 'pt' ? 'Voltar para o login' : 'Back to login'}
        </button>
      )}
      
      <div className="pt-4 text-center text-sm">
        <p className="text-muted-foreground">
          {language === 'pt' ? 'Não tem uma conta?' : "Don't have an account?"}
          <Link to="/register" className="text-primary hover:underline ml-1">
            {language === 'pt' ? 'Registrar' : 'Register'}
          </Link>
        </p>
        
        <button
          type="button"
          onClick={toggleDemoCredentials}
          className="mt-4 text-xs flex items-center justify-center mx-auto text-muted-foreground hover:text-primary"
        >
          {showDemoCredentials ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
          {language === 'pt' ? 'Credenciais de demonstração' : 'Demo credentials'}
        </button>
        
        {showDemoCredentials && (
          <div className="mt-2 pt-2 border-t border-input text-xs text-muted-foreground">
            <p>{language === 'pt' ? 'Contas de demonstração:' : 'Demo accounts:'}</p>
            <p>admin@omnicare.com</p>
            <p>doctor@omnicare.com</p>
            <p>nurse@omnicare.com</p>
            <p className="mt-1 font-semibold">{language === 'pt' ? 'Senha: password123' : 'Password: password123'}</p>
            <p className="mt-1 text-xs text-destructive">{language === 'pt' ? 'Importante: Esta senha é obrigatória para contas de demonstração' : 'Important: This password is required for demo accounts'}</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default EmailLoginForm;

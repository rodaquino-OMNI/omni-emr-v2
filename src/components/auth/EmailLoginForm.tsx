
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCheck, Loader2, KeyRound, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
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
  toggleForgotPassword
}: EmailLoginFormProps) => {
  const [showDemoCredentials, setShowDemoCredentials] = useState<boolean>(false);

  const toggleDemoCredentials = () => {
    setShowDemoCredentials(!showDemoCredentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('email')}
        </label>
        <Input
          id="email"
          type="email"
          className={`w-full h-10 px-3 rounded-md ${
            validationErrors.email ? 'border-destructive' : 'border-input'
          }`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationErrors.email) {
              setValidationErrors({
                ...validationErrors,
                email: ''
              });
            }
          }}
          disabled={isSubmitting}
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
              >
                {language === 'pt' ? 'Esqueceu a senha?' : 'Forgot password?'}
              </button>
            )}
          </div>
          <Input
            id="password"
            type="password"
            className={`w-full h-10 px-3 rounded-md ${
              validationErrors.password ? 'border-destructive' : 'border-input'
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors({
                  ...validationErrors,
                  password: ''
                });
              }
            }}
            disabled={isSubmitting}
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
        className="w-full mt-6" 
        disabled={isSubmitting}
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
            <p className="mt-1">{language === 'pt' ? 'Senha: any' : 'Password: any'}</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default EmailLoginForm;

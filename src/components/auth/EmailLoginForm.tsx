
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2 } from 'lucide-react';
import { Language } from '@/types/auth';

interface EmailLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  validationErrors: { [key: string]: string };
  setValidationErrors: (errors: { [key: string]: string }) => void;
  language: Language;
  t: (key: string) => string;
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
  t
}: EmailLoginFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          className={`w-full h-10 px-3 rounded-md border ${
            validationErrors.email ? 'border-destructive' : 'border-border'
          } bg-background`}
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
          placeholder="admin@medcare.com"
        />
        {validationErrors.email && (
          <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          {t('password')}
        </label>
        <input
          id="password"
          type="password"
          className={`w-full h-10 px-3 rounded-md border ${
            validationErrors.password ? 'border-destructive' : 'border-border'
          } bg-background`}
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
        />
        {validationErrors.password && (
          <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {language === 'pt' ? 'Entrando...' : 'Signing in...'}
          </>
        ) : (
          <>
            <UserCheck className="mr-2 h-4 w-4" />
            {t('signIn')}
          </>
        )}
      </Button>
      
      <div className="pt-4 text-center text-sm">
        <p className="text-muted-foreground">
          {language === 'pt' ? 'Não tem uma conta?' : "Don't have an account?"}
          <Link to="/register" className="text-primary hover:underline ml-1">
            {language === 'pt' ? 'Registrar' : 'Register'}
          </Link>
        </p>
        
        <div className="mt-4 pt-4 border-t border-border">
          <p>{language === 'pt' ? 'Contas de demonstração:' : 'Demo accounts:'}</p>
          <p>admin@omnicare.com</p>
          <p>doctor@omnicare.com</p>
          <p>nurse@omnicare.com</p>
          <p className="mt-1">{language === 'pt' ? 'Senha: qualquer' : 'Password: any'}</p>
        </div>
      </div>
    </form>
  );
};

export default EmailLoginForm;

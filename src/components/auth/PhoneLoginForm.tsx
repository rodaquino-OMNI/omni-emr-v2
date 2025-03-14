
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Phone, Check } from 'lucide-react';
import { Language } from '@/types/auth';

interface PhoneLoginFormProps {
  phone: string;
  setPhone: (phone: string) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  handlePhoneSubmit: (e: React.FormEvent) => Promise<void>;
  handleVerifySubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  verificationSent: boolean;
  validationErrors: { [key: string]: string };
  setValidationErrors: (errors: { [key: string]: string }) => void;
  language: Language;
  t: (key: string) => string;
  resetForm: () => void;
}

const PhoneLoginForm = ({
  phone,
  setPhone,
  verificationCode,
  setVerificationCode,
  handlePhoneSubmit,
  handleVerifySubmit,
  isSubmitting,
  verificationSent,
  validationErrors,
  setValidationErrors,
  language,
  t,
  resetForm
}: PhoneLoginFormProps) => {
  return (
    <div className="space-y-4">
      {!verificationSent ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              {language === 'pt' ? 'Número de Telefone' : 'Phone Number'}
            </label>
            <Input
              id="phone"
              type="tel"
              className={`w-full h-10 px-3 rounded-md ${
                validationErrors.phone ? 'border-destructive' : 'border-input'
              }`}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (validationErrors.phone) {
                  setValidationErrors({
                    ...validationErrors,
                    phone: ''
                  });
                }
              }}
              disabled={isSubmitting}
              placeholder="+1234567890"
            />
            {validationErrors.phone && (
              <p className="text-xs text-destructive mt-1">{validationErrors.phone}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {language === 'pt' ? 'Enviando...' : 'Sending...'}
              </>
            ) : (
              <>
                <Phone className="h-4 w-4 mr-2" />
                {language === 'pt' ? 'Enviar Código de Verificação' : 'Send Verification Code'}
              </>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-sm font-medium">
              {language === 'pt' ? 'Código de Verificação' : 'Verification Code'}
            </label>
            <Input
              id="verification-code"
              type="text"
              className={`w-full h-10 px-3 rounded-md ${
                validationErrors.code ? 'border-destructive' : 'border-input'
              }`}
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                if (validationErrors.code) {
                  setValidationErrors({
                    ...validationErrors,
                    code: ''
                  });
                }
              }}
              disabled={isSubmitting}
              placeholder="123456"
            />
            {validationErrors.code && (
              <p className="text-xs text-destructive mt-1">{validationErrors.code}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {language === 'pt' 
                ? `Código enviado para ${phone}` 
                : `Code sent to ${phone}`}
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {language === 'pt' ? 'Verificando...' : 'Verifying...'}
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {language === 'pt' ? 'Verificar Código' : 'Verify Code'}
              </>
            )}
          </Button>
          
          <Button 
            type="button"
            variant="ghost"
            className="w-full mt-2 text-xs" 
            onClick={resetForm}
          >
            {language === 'pt' 
              ? 'Voltar e usar outro método de login' 
              : 'Go back and use another login method'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default PhoneLoginForm;

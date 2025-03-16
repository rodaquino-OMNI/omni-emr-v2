
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
  handlePhoneSubmit: (e: React.FormEvent, validateForm: () => boolean) => Promise<void>;
  handleVerifySubmit: (e: React.FormEvent, validateForm: () => boolean) => Promise<void>;
  handleClearError: () => void;
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
  handleClearError,
  isSubmitting,
  verificationSent,
  validationErrors,
  setValidationErrors,
  language,
  t,
  resetForm
}: PhoneLoginFormProps) => {
  // Validation function for the phone form
  const validatePhoneForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!phone.trim()) {
      errors.phone = language === 'pt' 
        ? 'Número de telefone é obrigatório'
        : 'Phone number is required';
    } else if (!/^\+[1-9]\d{1,14}$/.test(phone)) {
      errors.phone = language === 'pt'
        ? 'Formato inválido. Use formato internacional (+123...)'
        : 'Invalid format. Use international format (+123...)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validation function for the verification form
  const validateVerificationForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!verificationCode.trim()) {
      errors.code = language === 'pt'
        ? 'Código de verificação é obrigatório'
        : 'Verification code is required';
    } else if (!/^\d{6}$/.test(verificationCode)) {
      errors.code = language === 'pt'
        ? 'Código deve ter 6 dígitos'
        : 'Code must be 6 digits';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-4">
      {!verificationSent ? (
        <form onSubmit={(e) => handlePhoneSubmit(e, validatePhoneForm)} className="space-y-4">
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
                handleClearError();
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
        <form onSubmit={(e) => handleVerifySubmit(e, validateVerificationForm)} className="space-y-4">
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
                handleClearError();
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

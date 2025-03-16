
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useTranslation } from '@/hooks/useTranslation';
import { Shield, X, QrCode, Smartphone } from 'lucide-react';

export interface MFASetupProps {
  onClose: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'scan' | 'verify'>('scan');
  const [otpValue, setOtpValue] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle MFA setup verification
    if (step === 'verify') {
      // Verify the OTP
      console.log('Verifying OTP:', otpValue);
      // On success
      onClose();
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('setupTwoFactorAuthentication')}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {step === 'scan'
              ? t('scanQRCodeWithAuthenticator')
              : t('enterVerificationCodeFromAuthenticator')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 'scan' ? (
            <div className="flex flex-col items-center gap-6">
              <div className="bg-gray-100 rounded-lg p-4 mx-auto">
                <QrCode className="h-40 w-40 mx-auto text-primary" />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-medium">{t('cantScanCode')}</p>
                <div className="bg-muted p-3 rounded text-center">
                  <code className="text-xs">OMNICARE-SEC-123456789</code>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <Smartphone className="h-16 w-16 text-primary opacity-80" />
              
              <div className="w-full">
                <label className="block text-sm font-medium mb-2">
                  {t('verificationCode')}
                </label>
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step === 'scan' ? (
            <Button
              type="button"
              onClick={() => setStep('verify')}
              className="ml-auto"
            >
              {t('next')}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('scan')}
              >
                {t('back')}
              </Button>
              <Button type="submit">
                {t('verify')}
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default MFASetup;

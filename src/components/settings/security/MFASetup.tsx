
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getUserMFAFactors, startMFASetup, verifyMFASetup, unenrollMFA } from '@/utils/auth/securityUtils';
import { useAuth } from '@/context/AuthContext';

const MFASetup = () => {
  const { user, language } = useAuth();
  const [factors, setFactors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setupData, setSetupData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isSetupMode, setIsSetupMode] = useState<boolean>(false);
  
  useEffect(() => {
    loadFactors();
  }, [user]);
  
  const loadFactors = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userFactors = await getUserMFAFactors(user.id);
      setFactors(userFactors);
    } catch (error) {
      console.error('Error loading MFA factors:', error);
      toast.error(
        language === 'pt' ? "Erro ao carregar fatores MFA" : "Error loading MFA factors",
        { description: String(error) }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartSetup = async () => {
    setIsLoading(true);
    try {
      const data = await startMFASetup();
      setSetupData(data);
      setIsSetupMode(true);
    } catch (error) {
      console.error('Error starting MFA setup:', error);
      toast.error(
        language === 'pt' ? "Erro ao iniciar configuração MFA" : "Error starting MFA setup",
        { description: String(error) }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifySetup = async () => {
    if (!setupData || !verificationCode) return;
    
    setIsLoading(true);
    try {
      const success = await verifyMFASetup(setupData.id, verificationCode);
      
      if (success) {
        toast.success(
          language === 'pt' ? "Autenticação multi-fator habilitada!" : "Multi-factor authentication enabled!",
          { 
            description: language === 'pt' 
              ? "Sua conta está agora mais segura" 
              : "Your account is now more secure"
          }
        );
        setIsSetupMode(false);
        loadFactors();
      } else {
        toast.error(
          language === 'pt' ? "Código inválido" : "Invalid code",
          { 
            description: language === 'pt' 
              ? "Por favor verifique o código e tente novamente" 
              : "Please check the code and try again"
          }
        );
      }
    } catch (error) {
      console.error('Error verifying MFA setup:', error);
      toast.error(
        language === 'pt' ? "Erro ao verificar configuração MFA" : "Error verifying MFA setup",
        { description: String(error) }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisableMFA = async (factorId: string) => {
    if (!factorId) return;
    
    setIsLoading(true);
    try {
      const success = await unenrollMFA(factorId);
      
      if (success) {
        toast.success(
          language === 'pt' ? "Autenticação multi-fator desabilitada" : "Multi-factor authentication disabled",
          { 
            description: language === 'pt' 
              ? "MFA foi removido da sua conta" 
              : "MFA has been removed from your account"
          }
        );
        loadFactors();
      }
    } catch (error) {
      console.error('Error disabling MFA:', error);
      toast.error(
        language === 'pt' ? "Erro ao desabilitar MFA" : "Error disabling MFA",
        { description: String(error) }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasMFAEnabled = factors.some(factor => factor.status === 'verified');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {language === 'pt' ? "Autenticação Multi-Fator (MFA)" : "Multi-Factor Authentication (MFA)"}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? "Aumente a segurança da sua conta adicionando uma camada extra de proteção."
            : "Enhance your account security by adding an extra layer of protection."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSetupMode ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="font-medium mb-2">
                  {language === 'pt' ? "Configurar autenticador" : "Set up authenticator"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'pt'
                    ? "Escaneie o código QR com o seu aplicativo autenticador (como Google Authenticator ou Authy)"
                    : "Scan the QR code with your authenticator app (like Google Authenticator or Authy)"}
                </p>
                
                {setupData?.totp?.qr_code && (
                  <div className="flex justify-center mb-4">
                    <img 
                      src={setupData.totp.qr_code} 
                      alt="MFA QR Code" 
                      className="border border-border rounded-md"
                      width={200}
                      height={200}
                    />
                  </div>
                )}
                
                {setupData?.totp?.secret && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">
                      {language === 'pt' ? "Ou insira este código manualmente:" : "Or enter this code manually:"}
                    </p>
                    <code className="bg-background p-2 rounded border border-border text-sm">
                      {setupData.totp.secret}
                    </code>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <label htmlFor="verification-code" className="text-sm font-medium block mb-2">
                  {language === 'pt' ? "Código de verificação" : "Verification code"}
                </label>
                <Input
                  id="verification-code"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {hasMFAEnabled ? (
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5" />
                  <div>
                    <p className="font-medium">
                      {language === 'pt' ? "MFA está ativado" : "MFA is enabled"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'pt'
                        ? "Sua conta está protegida com autenticação multi-fator."
                        : "Your account is protected with multi-factor authentication."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-amber-600 dark:text-amber-400 h-5 w-5" />
                  <div>
                    <p className="font-medium">
                      {language === 'pt' ? "MFA não está configurado" : "MFA is not set up"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'pt'
                        ? "Sua conta está desprotegida contra acesso não autorizado."
                        : "Your account is unprotected against unauthorized access."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {isSetupMode ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsSetupMode(false);
                setSetupData(null);
                setVerificationCode('');
              }}
              disabled={isLoading}
            >
              {language === 'pt' ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              onClick={handleVerifySetup}
              disabled={isLoading || !verificationCode}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  {language === 'pt' ? "Verificando..." : "Verifying..."}
                </>
              ) : (
                <>{language === 'pt' ? "Verificar" : "Verify"}</>
              )}
            </Button>
          </>
        ) : (
          <>
            {hasMFAEnabled ? (
              <Button
                variant="destructive"
                onClick={() => factors.length > 0 && handleDisableMFA(factors[0].id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    {language === 'pt' ? "Desabilitando..." : "Disabling..."}
                  </>
                ) : (
                  <>{language === 'pt' ? "Desabilitar MFA" : "Disable MFA"}</>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleStartSetup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    {language === 'pt' ? "Carregando..." : "Loading..."}
                  </>
                ) : (
                  <>{language === 'pt' ? "Configurar MFA" : "Set up MFA"}</>
                )}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MFASetup;

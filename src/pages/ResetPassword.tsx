
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { updatePassword } from '@/utils/signUpUtils';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const { language } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [resetComplete, setResetComplete] = useState(false);
  const [validHash, setValidHash] = useState(false);
  
  useEffect(() => {
    // Check if the hash is valid on component mount
    const checkHash = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          toast.error(
            language === 'pt' ? 'Link inválido' : 'Invalid link',
            { description: language === 'pt' ? 'Este link é inválido ou expirou' : 'This link is invalid or has expired' }
          );
          navigate('/login');
          return;
        }
        
        if (data?.session) {
          setValidHash(true);
        } else {
          toast.error(
            language === 'pt' ? 'Link expirado' : 'Link expired',
            { description: language === 'pt' ? 'Este link expirou. Solicite um novo' : 'This link has expired. Please request a new one' }
          );
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking hash:', error);
        navigate('/login');
      }
    };
    
    checkHash();
  }, [navigate, language]);
  
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!password) {
      errors.password = language === 'pt' ? 'A senha é obrigatória' : 'Password is required';
    } else if (password.length < 6) {
      errors.password = language === 'pt' 
        ? 'A senha deve ter pelo menos 6 caracteres' 
        : 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = language === 'pt' 
        ? 'As senhas não coincidem' 
        : 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updatePassword(password);
      
      if (result.success) {
        setResetComplete(true);
        toast.success(
          language === 'pt' ? 'Senha atualizada' : 'Password updated',
          { description: language === 'pt' ? 'Sua senha foi atualizada com sucesso' : 'Your password has been successfully updated' }
        );
      }
    } catch (error: any) {
      toast.error(
        language === 'pt' ? 'Erro ao atualizar senha' : 'Error updating password',
        { description: error.message || (language === 'pt' ? 'Ocorreu um erro' : 'An error occurred') }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!validHash) {
    return null; // Don't render anything while checking the hash
  }
  
  if (resetComplete) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-background">
        <div className="container max-w-lg px-4 py-8 mx-auto">
          <Card className="w-full shadow-md">
            <CardContent className="pt-6 pb-6 text-center space-y-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {language === 'pt' ? 'Senha atualizada!' : 'Password updated!'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'pt' 
                    ? 'Sua senha foi alterada com sucesso.' 
                    : 'Your password has been successfully changed.'}
                </p>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full">
                {language === 'pt' ? 'Voltar para o login' : 'Back to login'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center bg-background">
      <div className="container max-w-lg px-4 py-8 mx-auto">
        <Card className="w-full shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {language === 'pt' ? 'Redefinir senha' : 'Reset password'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' 
                ? 'Escolha uma nova senha para sua conta'
                : 'Choose a new password for your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'pt' ? 'Nova senha' : 'New password'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({...validationErrors, password: ''});
                    }
                  }}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={validationErrors.password ? 'border-destructive' : ''}
                />
                {validationErrors.password && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {language === 'pt' ? 'Confirmar nova senha' : 'Confirm new password'}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors({...validationErrors, confirmPassword: ''});
                    }
                  }}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={validationErrors.confirmPassword ? 'border-destructive' : ''}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.confirmPassword}</p>
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
                    {language === 'pt' ? 'Atualizando...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-2" />
                    {language === 'pt' ? 'Atualizar senha' : 'Update password'}
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'pt' ? 'Voltar para o login' : 'Back to login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;

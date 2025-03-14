
import React, { useState } from 'react';
import { KeyRound, AlertTriangle, Check, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logAuditEvent } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkPasswordLeak, checkPasswordStrength } from '@/utils/auth/securityUtils';
import { Progress } from "@/components/ui/progress";

const PasswordUpdateForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isLeaked, setIsLeaked] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthFeedback, setStrengthFeedback] = useState('');
  
  const { user, language } = useAuth();
  
  const checkForLeakedPassword = async (password: string) => {
    if (password.length < 6) return;
    
    setChecking(true);
    try {
      const leaked = await checkPasswordLeak(password);
      setIsLeaked(leaked);
      
      if (leaked) {
        toast.error(
          language === 'pt' ? "Senha comprometida" : "Compromised password",
          {
            description: language === 'pt' 
              ? "Esta senha foi encontrada em vazamentos de dados. Por favor escolha outra." 
              : "This password was found in data breaches. Please choose another one."
          }
        );
      }
      
      // Also check strength
      const { score, feedback } = checkPasswordStrength(password);
      setStrengthScore(score);
      setStrengthFeedback(feedback);
      
    } finally {
      setChecking(false);
    }
  };
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    
    // Check strength immediately
    const { score, feedback } = checkPasswordStrength(password);
    setStrengthScore(score);
    setStrengthFeedback(feedback);
    
    // Debounce the password leak check
    if (password.length >= 8) {
      const timer = setTimeout(() => {
        checkForLeakedPassword(password);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setIsLeaked(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error(
        language === 'pt' ? "Senhas não coincidem" : "Passwords don't match",
        {
          description: language === 'pt' 
            ? "A nova senha e a confirmação devem ser iguais." 
            : "New password and confirmation password must match."
        }
      );
      return;
    }
    
    if (isLeaked) {
      toast.error(
        language === 'pt' ? "Senha comprometida" : "Compromised password",
        {
          description: language === 'pt' 
            ? "Esta senha foi encontrada em vazamentos de dados. Por favor escolha outra." 
            : "This password was found in data breaches. Please choose another one."
        }
      );
      return;
    }
    
    if (strengthScore < 4) {
      toast.error(
        language === 'pt' ? "Senha fraca" : "Weak password",
        {
          description: language === 'pt' 
            ? "Sua senha não é forte o suficiente. Use pelo menos 8 caracteres com letras, números e símbolos." 
            : "Your password is not strong enough. Use at least 8 characters with mixed case, numbers, and symbols."
        }
      );
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real application, this would update the password in Supabase
      // For demo, we'll just simulate success
      
      // Log the password update event
      if (user) {
        await logAuditEvent(
          user.id,
          'update',
          'user_security',
          user.id,
          { changed_password: true }
        );
      }
      
      toast.success(
        language === 'pt' ? "Configurações de segurança atualizadas" : "Security settings updated",
        {
          description: language === 'pt' 
            ? "Suas configurações de segurança foram atualizadas com sucesso." 
            : "Your security settings have been successfully updated."
        }
      );
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStrengthScore(0);
      setStrengthFeedback('');
      setIsLeaked(false);
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast.error(
        language === 'pt' ? "Falha na atualização" : "Update failed",
        {
          description: language === 'pt' 
            ? "Falha ao atualizar configurações de segurança. Tente novamente." 
            : "Failed to update security settings. Please try again."
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to get progress bar color based on strength score
  const getStrengthColor = () => {
    if (strengthScore <= 3) return "bg-destructive";
    if (strengthScore <= 6) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">
        {language === 'pt' ? "Atualizar Senha" : "Update Password"}
      </h2>
      <p className="text-muted-foreground mb-6">
        {language === 'pt' 
          ? "Certifique-se de que sua conta esteja usando uma senha forte para manter sua conta segura." 
          : "Ensure your account is using a strong password to keep your account secure."}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">
              {language === 'pt' ? "Senha Atual" : "Current Password"}
            </label>
            <input
              id="currentPassword"
              type="password"
              className="w-full h-10 px-3 rounded-md border border-border bg-background"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              {language === 'pt' ? "Nova Senha" : "New Password"}
            </label>
            <input
              id="newPassword"
              type="password"
              className={`w-full h-10 px-3 rounded-md border ${isLeaked ? 'border-destructive' : 'border-border'} bg-background`}
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
              minLength={8}
            />
            
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {language === 'pt' ? "Força da senha" : "Password strength"}
                  </span>
                  <span className="text-xs font-medium">
                    {strengthScore > 6 
                      ? (language === 'pt' ? "Forte" : "Strong") 
                      : strengthScore > 3 
                        ? (language === 'pt' ? "Média" : "Medium") 
                        : (language === 'pt' ? "Fraca" : "Weak")}
                  </span>
                </div>
                <Progress 
                  value={strengthScore * 10} 
                  className={`h-1.5 ${getStrengthColor()}`} 
                />
                <p className="text-xs text-muted-foreground mt-1">{strengthFeedback}</p>
                
                {isLeaked && (
                  <div className="flex items-center gap-1.5 text-destructive mt-1 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>
                      {language === 'pt' 
                        ? "Esta senha foi encontrada em vazamentos de dados" 
                        : "This password was found in data breaches"}
                    </span>
                  </div>
                )}
                
                {newPassword.length >= 8 && !isLeaked && (
                  <div className="flex items-center gap-1.5 text-emerald-500 mt-1 text-xs">
                    <Check className="h-3.5 w-3.5" />
                    <span>
                      {language === 'pt' 
                        ? "Senha não encontrada em vazamentos conhecidos" 
                        : "Password not found in known breaches"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {language === 'pt' ? "Confirmar Nova Senha" : "Confirm New Password"}
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full h-10 px-3 rounded-md border ${
                confirmPassword && newPassword !== confirmPassword ? 'border-destructive' : 'border-border'
              } bg-background`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {language === 'pt' ? "As senhas não coincidem" : "Passwords don't match"}
              </p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span>
                  {language === 'pt' 
                    ? "O sistema verifica vazamentos de senhas usando HaveIBeenPwned" 
                    : "Password breach detection powered by HaveIBeenPwned"}
                </span>
              </div>
              
              <button
                type="submit"
                className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1"
                disabled={loading || checking || isLeaked || (newPassword !== confirmPassword) || (newPassword.length > 0 && strengthScore < 4)}
              >
                <KeyRound className="h-4 w-4" />
                {language === 'pt' ? "Atualizar Senha" : "Update Password"}
                {loading && <span className="ml-2 animate-spin">↻</span>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdateForm;

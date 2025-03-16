
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, LockKeyhole } from 'lucide-react';

interface PasswordUpdateFormProps {
  onClose: () => void;
}

const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = ({ onClose }) => {
  const { language } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(
        language === 'pt' 
          ? 'Por favor, preencha todos os campos' 
          : 'Please fill in all fields'
      );
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error(
        language === 'pt' 
          ? 'As senhas não coincidem' 
          : 'Passwords do not match'
      );
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error(
        language === 'pt' 
          ? 'A senha deve ter pelo menos 8 caracteres' 
          : 'Password must be at least 8 characters'
      );
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate password update
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        language === 'pt' 
          ? 'Senha atualizada com sucesso' 
          : 'Password updated successfully'
      );
      onClose();
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LockKeyhole className="h-5 w-5 mr-2" />
          {language === 'pt' ? 'Atualizar Senha' : 'Update Password'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Altere sua senha para manter sua conta segura' 
            : 'Change your password to keep your account secure'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">
            {language === 'pt' ? 'Senha Atual' : 'Current Password'}
          </Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-password">
            {language === 'pt' ? 'Nova Senha' : 'New Password'}
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'pt' 
              ? 'A senha deve ter pelo menos 8 caracteres' 
              : 'Password must be at least 8 characters'}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">
            {language === 'pt' ? 'Confirmar Nova Senha' : 'Confirm New Password'}
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onClose}>
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button onClick={handleUpdatePassword} disabled={isSubmitting}>
          {isSubmitting 
            ? (language === 'pt' ? 'Atualizando...' : 'Updating...') 
            : (language === 'pt' ? 'Atualizar Senha' : 'Update Password')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordUpdateForm;

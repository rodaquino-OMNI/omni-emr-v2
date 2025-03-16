
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { Shield, X, EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';

export interface PasswordUpdateFormProps {
  onClose: () => void;
}

const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!currentPassword) {
      toast.error(t('currentPasswordRequired'));
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error(t('passwordTooShort'));
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    
    // Update password logic
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('passwordUpdatedSuccessfully'));
      onClose();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(t('errorUpdatingPassword'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('updatePassword')}
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
            {t('enterCurrentAndNewPassword')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('currentPassword')}</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('newPassword')}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('confirmNewPassword')}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          
          {newPassword && (
            <div className="text-sm">
              <p className="font-medium mb-1">{t('passwordRequirements')}:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                  {t('minimumCharacters')}
                </li>
                <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                  {t('uppercaseLetter')}
                </li>
                <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
                  {t('number')}
                </li>
                <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}>
                  {t('specialCharacter')}
                </li>
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mr-2"
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isLoading || !currentPassword || !newPassword || !confirmNewPassword}>
            {isLoading ? t('updating') : t('updatePassword')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordUpdateForm;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { language } = useTranslation();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleAvatarUpload = () => {
    setIsUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      setAvatarUrl('https://ui.shadcn.com/avatars/01.png');
      toast.success(
        language === 'pt' ? 'Imagem de perfil atualizada' : 'Profile picture updated'
      );
    }, 1500);
  };

  const handleProfileUpdate = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        language === 'pt' ? 'Perfil atualizado com sucesso' : 'Profile updated successfully'
      );
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'pt' ? 'Informações do Perfil' : 'Profile Information'}</CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Atualize suas informações pessoais e foto de perfil' 
            : 'Update your personal information and profile picture'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-2">
            <h3 className="text-base font-medium">
              {language === 'pt' ? 'Foto de Perfil' : 'Profile Picture'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'pt' 
                ? 'Esta foto será exibida em seu perfil e em seus comentários' 
                : 'This photo will be displayed on your profile and in your comments'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-fit"
              onClick={handleAvatarUpload}
              disabled={isUploading}
            >
              {isUploading 
                ? (language === 'pt' ? 'Enviando...' : 'Uploading...') 
                : (language === 'pt' ? 'Alterar Foto' : 'Change Photo')}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{language === 'pt' ? 'Nome' : 'Name'}</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{language === 'pt' ? 'Email' : 'Email'}</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled 
              />
              <p className="text-xs text-muted-foreground">
                {language === 'pt' 
                  ? 'O email não pode ser alterado' 
                  : 'Email cannot be changed'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{language === 'pt' ? 'Telefone' : 'Phone'}</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button
          onClick={handleProfileUpdate}
          disabled={isSaving}
        >
          {isSaving 
            ? (language === 'pt' ? 'Salvando...' : 'Saving...') 
            : (language === 'pt' ? 'Salvar Alterações' : 'Save Changes')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;

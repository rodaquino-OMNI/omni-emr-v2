
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '@/hooks/useTranslation';

const SidebarUserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  // Always initialize permissions hook regardless of user state
  const permissions = usePermissions();
  
  // Handle case when user is not available
  if (!user) {
    return null;
  }

  const initials = user.name
    ? `${user.name.split(' ')[0][0]}${user.name.split(' ')[1]?.[0] || ''}`
    : user.email?.[0] || '?';

  const goToSettings = () => {
    navigate('/settings');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 pt-2">
      <Avatar className="h-14 w-14">
        <AvatarImage src={user.avatar_url || undefined} alt={user.name || 'User'} />
        <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <div className="font-medium text-sm">{user.name || user.email}</div>
        <div className="text-xs text-muted-foreground">{t(user.role)}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToSettings}
          title={t('settings')}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleLogout}
          title={t('logout')}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SidebarUserProfile;

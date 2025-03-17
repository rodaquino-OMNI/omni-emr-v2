
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/stringUtils';
import { User } from '@/types/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronRight, LogOut, User as UserIcon, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface SidebarUserProfileProps {
  user: User;
  onItemClick?: () => void;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ 
  user, 
  onItemClick 
}) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleProfileClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleSettingsClick = () => {
    if (onItemClick) {
      onItemClick();
    }
    navigate('/settings');
  };
  
  const handleProfilePageClick = () => {
    if (onItemClick) {
      onItemClick();
    }
    navigate('/profile');
  };
  
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-primary/5 transition-all duration-200 rounded-md group">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-primary/10 transition-all duration-200 group-hover:border-primary/20">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.role ? (
                  <span className="capitalize">{user.role}</span>
                ) : (
                  t('userProfile')
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {t('accountOptions')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfilePageClick} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>{t('viewProfile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarUserProfile;

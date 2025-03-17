
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/stringUtils';
import { User } from '@/types/auth';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarUserProfileProps {
  user: User;
  onItemClick?: () => void;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ 
  user, 
  onItemClick 
}) => {
  const { t, language } = useTranslation();
  
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };
  
  if (!user) return null;

  return (
    <div className="flex items-center space-x-2 px-3 py-2" onClick={handleClick}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatarUrl || ''} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
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
  );
};

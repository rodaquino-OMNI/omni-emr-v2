
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { User as UserType } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarUserProfileProps {
  user: UserType | null;
  onClick?: () => void;
}

const SidebarUserProfile = ({ user, onClick }: SidebarUserProfileProps) => {
  const { t } = useTranslation();
  const permissions = usePermissions(user);
  
  if (!user) return null;
  
  // Get proper display name for user role
  const roleDisplayName = permissions.getRoleDisplayName();
  
  return (
    <div className="border-t border-border mt-auto pt-2 px-3 pb-4">
      <Link 
        to="/settings"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onClick}
      >
        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{user.name}</div>
          <div className="text-xs capitalize">{roleDisplayName}</div>
        </div>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
};

export default SidebarUserProfile;

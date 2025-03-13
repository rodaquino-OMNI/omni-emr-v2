
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { User as UserType } from '@/context/AuthContext';

interface SidebarUserProfileProps {
  user: UserType | null;
  onClick?: () => void;
}

const SidebarUserProfile = ({ user, onClick }: SidebarUserProfileProps) => {
  if (!user) return null;
  
  return (
    <div className="border-t border-border mt-auto pt-2 px-3 pb-4">
      <Link 
        to="/settings"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onClick}
      >
        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{user.name}</div>
          <div className="text-xs capitalize">{user.role}</div>
        </div>
      </Link>
    </div>
  );
};

export default SidebarUserProfile;

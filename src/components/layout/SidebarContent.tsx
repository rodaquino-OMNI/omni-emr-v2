
import React from 'react';
import SidebarLogo from './SidebarLogo';
import { MainNavigation } from './sidebar/MainNavigation';
import { SidebarUserProfile } from './SidebarUserProfile';
import { useAuth } from '@/context/AuthContext';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onItemClick }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full py-4">
      <SidebarLogo />
      
      <div className="flex-1 px-3 mt-6">
        <MainNavigation onItemClick={onItemClick} />
      </div>
      
      {user && (
        <div className="px-3 mt-auto pt-4">
          <SidebarUserProfile 
            user={user} 
            onItemClick={onItemClick} 
          />
        </div>
      )}
    </div>
  );
};

export default SidebarContent;

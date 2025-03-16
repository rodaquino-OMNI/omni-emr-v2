
import React from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarUserProfile from './SidebarUserProfile';
import QuickActions from './sidebar/QuickActions';
import MainNavigation from './sidebar/MainNavigation';
import { useAuth } from '@/context/AuthContext';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const { user } = useAuth();
  
  return (
    <>
      <SidebarLogo />
      
      <div className="px-3 space-y-1 flex-1 overflow-y-auto">
        {/* Quick actions section - shown for roles with quick actions */}
        <QuickActions onItemClick={onItemClick} />
        
        {/* Main navigation items */}
        <MainNavigation onItemClick={onItemClick} />
      </div>
      
      <SidebarUserProfile user={user} onClick={onItemClick} />
    </>
  );
};

export default SidebarContent;

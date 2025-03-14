import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import SidebarUserProfile from './SidebarUserProfile';
import { sidebarItems } from '@/config/sidebarConfig';
import { hasPermission } from '@/utils/permissions/index';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Filter and sort items by priority
  const visibleItems = sidebarItems
    .filter(item => hasPermission(user, item.permissionRequired || ''))
    .sort((a, b) => a.priority - b.priority);
  
  return (
    <>
      <SidebarLogo />
      
      <div className="px-3 space-y-1 flex-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            onClick={onItemClick}
          />
        ))}
      </div>
      
      <SidebarUserProfile user={user} onClick={onItemClick} />
    </>
  );
};

export default SidebarContent;

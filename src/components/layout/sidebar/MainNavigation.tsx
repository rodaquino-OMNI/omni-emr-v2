
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '@/hooks/useTranslation';
import { sidebarItems } from '@/config/sidebarConfig';
import SidebarItem from '../SidebarItem';

interface MainNavigationProps {
  onItemClick?: () => void;
}

const MainNavigation = ({ onItemClick }: MainNavigationProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const permissions = usePermissions(user);
  
  // Filter items based on user permissions and role but not removing items
  const visibleItems = sidebarItems
    .filter(item => {
      // If user is not logged in, show all items for debugging
      if (!user) return true;
      
      // If no permission required, show to everyone
      if (!item.permissionRequired) return true;
      
      // Check if user has the required permission
      return permissions.hasPermission(item.permissionRequired);
    })
    .sort((a, b) => a.priority - b.priority);
  
  return (
    <>
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('mainNavigation', 'Main Navigation')} ({visibleItems.length} {t('items', 'items')})
        </h3>
      </div>
      
      {visibleItems.map((item) => (
        <SidebarItem
          key={item.path}
          item={item}
          onClick={onItemClick}
        />
      ))}
    </>
  );
};

export default MainNavigation;

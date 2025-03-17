
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '@/hooks/useTranslation';
import { sidebarItems, filterSidebarItemsByFunctionBlocks } from '@/config/sidebarConfig';
import SidebarItem from '../SidebarItem';
import { useSectorContext } from '@/hooks/useSectorContext';

interface MainNavigationProps {
  onItemClick?: () => void;
}

const MainNavigation = ({ onItemClick }: MainNavigationProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const permissions = usePermissions(user);
  const { selectedSector } = useSectorContext();
  
  // Helper function to check if user has access to a function block
  const hasAccessToFunctionBlock = (functionBlockId: string): boolean => {
    // If no function block required or no user, return true (for development)
    if (!functionBlockId || !user) return true;
    
    // Check if user has permission for this function block
    return permissions.hasPermission(functionBlockId);
  };
  
  // Filter items based on user permissions, roles, and function blocks
  const visibleItems = filterSidebarItemsByFunctionBlocks(
    sidebarItems,
    hasAccessToFunctionBlock
  )
    .filter(item => {
      // If user is not logged in, show all items for debugging
      if (!user) return true;
      
      // If no permission required, show to everyone
      if (!item.permissionRequired) return true;
      
      // If item requires specific roles, check if user has any of those roles
      if (item.roles && item.roles.length > 0) {
        if (!user.role || !item.roles.includes(user.role)) {
          return false;
        }
      }
      
      // Check if user has the required permission
      return permissions.hasPermission(item.permissionRequired);
    })
    .sort((a, b) => a.priority - b.priority);
  
  // Display warning if no sector is selected for clinical sections
  const showSectorRequiredWarning = !selectedSector && user && 
    ['doctor', 'nurse', 'medical_staff'].includes(user.role);
  
  return (
    <>
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('mainNavigation', 'Main Navigation')}
        </h3>
      </div>
      
      {showSectorRequiredWarning && (
        <div className="mx-3 my-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700">
          {t('selectSectorWarning', 'Please select a sector to access clinical functions')}
        </div>
      )}
      
      {visibleItems.map((item) => (
        <SidebarItem
          key={item.path}
          item={item}
          onClick={onItemClick}
          disabled={item.functionBlockRequired === 'clinical' && !selectedSector}
        />
      ))}
    </>
  );
};

export default MainNavigation;

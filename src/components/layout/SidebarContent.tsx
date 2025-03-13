import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import SidebarUserProfile from './SidebarUserProfile';
import { sidebarItems } from '@/config/sidebarConfig';
import { rolePermissions } from '@/utils/permissions';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (!user) return false;
    
    // Admins have all permissions
    if (user.role === 'admin') {
      return true;
    }
    
    // Check if permissions array exists and contains the required permission
    if (user.permissions && Array.isArray(user.permissions)) {
      if (user.permissions.includes('all')) {
        return true;
      }
      return user.permissions.includes(permission);
    }
    
    // If permissions are undefined/null but we have a role, use the role permissions
    if (user.role && rolePermissions[user.role]) {
      return rolePermissions[user.role].includes(permission) || 
             rolePermissions[user.role].includes('all');
    }
    
    return false;
  };
  
  // Filter and sort items by priority
  const visibleItems = sidebarItems
    .filter(item => hasPermission(item.permissionRequired))
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

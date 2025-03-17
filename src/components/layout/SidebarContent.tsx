
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import SidebarItem from './SidebarItem';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarLogo from './SidebarLogo';
import SidebarSectorSelector from './SidebarSectorSelector';
import { config } from '@/config/sidebarConfig';

const SidebarContent: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const role = user?.role || 'unauthenticated';
  
  // Get navigation items for the user's role
  const navItems = config.roles[role] || config.roles.default;
  
  // Check if user is a clinical role that needs sector selection
  const isClinicalRole = ['doctor', 'nurse', 'medical_staff'].includes(role);
  
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-2">
        <SidebarLogo />
      </div>
      
      {/* Profile information */}
      <div className="px-3 py-2">
        <SidebarUserProfile />
      </div>
      
      {/* Sector Selector for clinical roles */}
      {isClinicalRole && <SidebarSectorSelector />}
      
      {/* Navigation Items */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item, index) => (
            <SidebarItem 
              key={index}
              title={t(item.i18nKey, item.title)}
              icon={item.icon}
              path={item.path}
              badge={item.badge}
            />
          ))}
        </nav>
      </div>
      
      {/* Footer Items */}
      <div className="mt-auto border-t bg-muted/40">
        <div className="grid items-start px-2 py-2 text-sm font-medium">
          {config.footer.map((item, index) => (
            <SidebarItem 
              key={index} 
              title={t(item.i18nKey, item.title)} 
              icon={item.icon} 
              path={item.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;

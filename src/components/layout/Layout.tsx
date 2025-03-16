
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { UserRole } from '@/types/auth';

const Layout: React.FC = () => {
  const { user } = useAuth();
  
  // Get role-specific layout components if available
  const HeaderComponent = user?.role
    ? componentRegistry.getComponent('header', user.role as UserRole) || Header
    : Header;
  
  const SidebarComponent = user?.role
    ? componentRegistry.getComponent('sidebar', user.role as UserRole) || Sidebar
    : Sidebar;
  
  return (
    <div className="min-h-screen flex bg-background">
      <SidebarComponent />
      <div className="flex-1 flex flex-col">
        <HeaderComponent />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

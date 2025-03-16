
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const { dashboardType } = useRoleBasedDashboard();
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

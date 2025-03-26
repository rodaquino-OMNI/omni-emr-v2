
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { UserRole } from '@/types/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const { selectedSector, sectors, isLoading } = useSectorContext();
  const { t } = useTranslation();
  
  // Get role-specific layout components if available
  const HeaderComponent = user?.role
    ? componentRegistry.getComponent('header', user.role as UserRole) || Header
    : Header;
  
  const SidebarComponent = user?.role
    ? componentRegistry.getComponent('sidebar', user.role as UserRole) || Sidebar
    : Sidebar;
  
  // Determine if user should select a sector
  const isClinicalRole = user?.role && ['doctor', 'nurse', 'medical_staff'].includes(user.role);
  const shouldSelectSector = isClinicalRole && !selectedSector && !isLoading && sectors.length > 0;
  console.log('[DEBUG] Layout component rendering with:', {
    userRole: user?.role,
    selectedSector: selectedSector?.name,
    shouldSelectSector,
    componentId: 'layout-wrapper'
  });
  // Log outside of JSX to avoid 'void' type error
  console.log('[DEBUG] Layout rendering SidebarComponent');
  
  // Add diagnostic logs to help identify the issue
  console.log('[DEBUG] Layout JSX structure check - about to render');
  console.log('[DEBUG] HeaderComponent type:', typeof HeaderComponent);
  console.log('[DEBUG] SidebarComponent type:', typeof SidebarComponent);
  
  return (
    <div className="min-h-screen flex bg-background">
      <SidebarComponent />
      <div className="flex-1 flex flex-col">
        <HeaderComponent />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          {shouldSelectSector && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('sectorSelectionRequired', 'Please select a sector to access clinical functions')}
              </AlertDescription>
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '@/hooks/useTranslation';
import SidebarSectorSelector from './SidebarSectorSelector';
import {
  Home,
  Users,
  FileText,
  Settings,
  PanelLeft,
  LogOut,
  Book,
  CalendarDays,
  Pill,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent as SidebarContentBase,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { hasPermission } = useRoleBasedDashboard();
  const isClinicalRole = user?.role && ['doctor', 'nurse', 'medical_staff'].includes(user.role);
  
  return (
    <>
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center gap-2">
          <PanelLeft className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">OmniCare</span>
        </div>
      </SidebarHeader>
      
      <SidebarContentBase>
        {/* Show sector selector only for clinical roles */}
        {isClinicalRole && (
          <SidebarSectorSelector />
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation', 'Navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={window.location.pathname === '/dashboard'}>
                  <NavLink to="/dashboard" onClick={onItemClick}>
                    <Home className="h-4 w-4" />
                    <span>{t('dashboard', 'Dashboard')}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {hasPermission('patients:view') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={window.location.pathname.startsWith('/patients')}>
                    <NavLink to="/patients" onClick={onItemClick}>
                      <Users className="h-4 w-4" />
                      <span>{t('patients', 'Patients')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission('medications:view') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={window.location.pathname.startsWith('/medications')}>
                    <NavLink to="/medications" onClick={onItemClick}>
                      <Pill className="h-4 w-4" />
                      <span>{t('medications', 'Medications')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission('notes:view') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={window.location.pathname.startsWith('/clinical-documentation')}>
                    <NavLink to="/clinical-documentation" onClick={onItemClick}>
                      <FileText className="h-4 w-4" />
                      <span>{t('clinicalDocumentation', 'Documentation')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission('appointments:view') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={window.location.pathname.startsWith('/appointments')}>
                    <NavLink to="/appointments" onClick={onItemClick}>
                      <CalendarDays className="h-4 w-4" />
                      <span>{t('appointments', 'Appointments')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('medical', 'Medical')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hasPermission('protocols:view') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={window.location.pathname.startsWith('/protocols')}>
                    <NavLink to="/protocols" onClick={onItemClick}>
                      <Book className="h-4 w-4" />
                      <span>{t('protocols', 'Protocols')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContentBase>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {hasPermission('settings:view') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={window.location.pathname.startsWith('/settings')}>
                    <NavLink to="/settings" onClick={onItemClick}>
                      <Settings className="h-4 w-4" />
                      <span>{t('settings', 'Settings')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => { logout(); onItemClick?.(); }}>
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout', 'Logout')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </>
  );
};

export default SidebarContent;

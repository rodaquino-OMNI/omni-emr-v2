
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { 
  LucideIcon, 
  Home, 
  Users, 
  FileText, 
  Pill, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Video, 
  HelpCircle,
  Menu,
  X,
  User,
  ClipboardList
} from 'lucide-react';

type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  translationKey: string;
  permissionRequired?: string;
};

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    translationKey: 'dashboard'
  },
  {
    name: 'Patients',
    path: '/patients',
    icon: Users,
    translationKey: 'patients'
  },
  {
    name: 'Records',
    path: '/records',
    icon: FileText,
    translationKey: 'records'
  },
  {
    name: 'Medications',
    path: '/medications',
    icon: Pill,
    translationKey: 'medications'
  },
  {
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: ClipboardList,
    translationKey: 'prescriptions'
  },
  {
    name: 'Schedule',
    path: '/schedule',
    icon: Calendar,
    translationKey: 'schedule',
    permissionRequired: 'view_schedule'
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    translationKey: 'messages'
  },
  {
    name: 'Telemedicine',
    path: '/telemedicine',
    icon: Video,
    translationKey: 'telemedicine',
    permissionRequired: 'telemedicine'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    translationKey: 'settings'
  },
  {
    name: 'Help & Support',
    path: '/help',
    icon: HelpCircle,
    translationKey: 'help'
  }
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    
    if (user?.role === 'admin') return true;
    
    return user?.permissions?.includes(permission);
  };
  
  const visibleItems = sidebarItems.filter(item => hasPermission(item.permissionRequired));
  
  const renderSidebarContent = () => (
    <>
      <div className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2 px-3 py-2">
          <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-white font-bold">
            MC
          </div>
          <span className="text-xl font-semibold tracking-tight">MedCare</span>
        </Link>
      </div>
      
      <div className="px-3 space-y-1 flex-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.translationKey as any)}</span>
            </Link>
          );
        })}
      </div>
      
      {user && (
        <div className="border-t border-border mt-auto pt-2 px-3 pb-4">
          <Link 
            to="/settings"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-xs capitalize">{user.role}</div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
  
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3 z-50 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {isOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
        )}
        
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border shadow-lg transform transition-transform duration-200 ease-in-out lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col h-full pt-12">
            {renderSidebarContent()}
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div className="hidden lg:flex lg:w-64 flex-col h-screen sticky top-0 border-r border-border bg-background z-10">
      {renderSidebarContent()}
    </div>
  );
};

export default Sidebar;


import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Pill, 
  Calendar, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Video
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../context/AuthContext";

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Main navigation items
  const navItems = [
    { name: t('dashboard'), path: "/dashboard", icon: LayoutDashboard, permission: 'view_dashboard' },
    { name: t('patients'), path: "/patients", icon: Users, permission: 'view_patients' },
    { name: t('records'), path: "/records", icon: ClipboardList, permission: 'view_records' },
    { name: t('medications'), path: "/medications", icon: Pill, permission: 'view_medications' },
    { name: t('schedule'), path: "/schedule", icon: Calendar, permission: 'view_schedule' },
    { name: t('messages'), path: "/messages", icon: MessageSquare, permission: 'view_messages' },
    { name: t('telemedicine'), path: "/telemedicine", icon: Video, permission: 'telemedicine' },
  ];
  
  // Bottom navigation items
  const bottomNavItems = [
    { name: t('settings'), path: "/settings", icon: Settings },
    { name: t('help'), path: "/help", icon: HelpCircle },
  ];

  // If user is admin, add admin panel
  if (user?.role === 'admin') {
    bottomNavItems.unshift({ name: t('userAdmin'), path: "/admin", icon: UserCog });
  }

  // Check if user has permission to see the item
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (!user) return false;
    
    return (
      user.role === 'admin' || 
      user.permissions.includes('all') || 
      user.permissions.includes(permission)
    );
  };

  return (
    <aside className={cn(
      "h-screen transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border relative",
      collapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            {t('appName')}
          </h1>
        )}
      </div>
      
      <nav className="p-3 flex flex-col h-[calc(100%-4rem)]">
        <div className="flex-1 space-y-1">
          {navItems.map((item) => 
            hasPermission(item.permission) && (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          )}
        </div>
        
        <div className="space-y-1 pt-4 border-t border-sidebar-border">
          {bottomNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </nav>
      
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};

export default Sidebar;

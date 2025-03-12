
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
  ChevronRight
} from "lucide-react";

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Patients", path: "/patients", icon: Users },
    { name: "Records", path: "/records", icon: ClipboardList },
    { name: "Medications", path: "/medications", icon: Pill },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Messages", path: "/messages", icon: MessageSquare },
  ];
  
  const bottomNavItems = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Help", path: "/help", icon: HelpCircle },
  ];

  return (
    <aside className={cn(
      "h-screen transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border relative",
      collapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            MedCare
          </h1>
        )}
      </div>
      
      <nav className="p-3 flex flex-col h-[calc(100%-4rem)]">
        <div className="flex-1 space-y-1">
          {navItems.map((item) => (
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

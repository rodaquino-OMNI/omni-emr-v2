
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface SidebarItemProps {
  label: string;
  icon?: LucideIcon | React.ElementType;
  to: string;
  badge?: string | number;
  onClick?: () => void;
  disabled?: boolean;
}

// Add support for passing a complete item object
interface SidebarItemWithObjectProps {
  item: {
    name?: string;
    label?: string;
    icon?: LucideIcon | React.ElementType;
    path: string;
    to?: string;
    badge?: string | number;
    translationKey?: string;
    disabled?: boolean;
  };
  onClick?: () => void;
  disabled?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps | SidebarItemWithObjectProps> = (props) => {
  // If we're working with an 'item' object
  if ('item' in props) {
    const { item, onClick, disabled } = props;
    const label = item.label || item.name || item.translationKey || '';
    const to = item.to || item.path || '';
    const Icon = item.icon;
    
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => 
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
            "hover:bg-primary/10 hover:text-primary hover:translate-x-1",
            isActive 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-foreground/70",
            (disabled || item.disabled) && "opacity-50 cursor-not-allowed pointer-events-none"
          )
        }
      >
        {Icon && (
          <div className="flex items-center justify-center w-5 h-5">
            <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
          </div>
        )}
        <span className="flex-1 truncate">{label}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </NavLink>
    );
  }
  
  // Traditional props usage
  const { label, icon: Icon, to, badge, onClick, disabled } = props;
  
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
          "hover:bg-primary/10 hover:text-primary hover:translate-x-1",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-foreground/70",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )
      }
    >
      {Icon && (
        <div className="flex items-center justify-center w-5 h-5">
          <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
        </div>
      )}
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto">
          {badge}
        </Badge>
      )}
    </NavLink>
  );
};

export default SidebarItem;

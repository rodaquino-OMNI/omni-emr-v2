
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
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  to,
  badge,
  onClick
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          "hover:bg-primary/10 hover:text-primary",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-foreground/70"
        )
      }
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto">{badge}</Badge>
      )}
    </NavLink>
  );
};

export default SidebarItem;

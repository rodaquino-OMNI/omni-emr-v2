
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { SidebarItem as SidebarItemType } from '@/config/sidebarConfig';

interface SidebarItemProps {
  item: SidebarItemType;
  onClick?: () => void;
  badge?: number;
  disabled?: boolean; // Added disabled prop
}

// Helper function to determine if an item is active based on the current path
const isItemActive = (itemPath: string, currentPath: string): boolean => {
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
};

// Helper function to get the appropriate CSS classes for the item
const getItemClasses = (isActive: boolean, disabled?: boolean): string => {
  return cn(
    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
    isActive 
      ? "bg-primary/10 text-primary" 
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none"
  );
};

// Helper function to render the badge if it exists
const renderBadge = (badge?: number): React.ReactNode => {
  if (!badge) return null;
  
  return (
    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
      {badge}
    </span>
  );
};

const SidebarItem = ({ item, onClick, badge, disabled }: SidebarItemProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const Icon = item.icon;
  
  const active = isItemActive(item.path, pathname);
  const itemClasses = getItemClasses(active, disabled);

  return (
    <Link 
      to={item.path}
      className={itemClasses}
      onClick={onClick}
      aria-disabled={disabled}
    >
      <Icon className="h-5 w-5" />
      <span>{t(item.translationKey as any)}</span>
      {renderBadge(badge)}
    </Link>
  );
};

export default SidebarItem;

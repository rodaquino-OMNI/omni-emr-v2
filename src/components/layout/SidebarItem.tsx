
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { SidebarItem as SidebarItemType } from '@/config/sidebarConfig';

interface SidebarItemProps {
  item: SidebarItemType;
  onClick?: () => void;
}

const SidebarItem = ({ item, onClick }: SidebarItemProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const Icon = item.icon;
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

  return (
    <Link 
      to={item.path}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{t(item.translationKey as any)}</span>
    </Link>
  );
};

export default SidebarItem;

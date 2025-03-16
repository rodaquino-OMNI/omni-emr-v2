
import React from 'react';
import HeaderLogo from './HeaderLogo';
import HeaderSearch from './HeaderSearch';
import HeaderNotifications from './HeaderNotifications';
import HeaderUserMenu from './HeaderUserMenu';
import HeaderSettingsButton from './HeaderSettingsButton';
import SectorSelector from './SectorSelector';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "flex h-16 items-center border-b bg-background px-4 md:px-6",
      className
    )}>
      <div className="flex items-center gap-2 md:gap-4">
        <HeaderLogo />
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <SectorSelector />
        <HeaderSearch />
        <HeaderNotifications />
        <HeaderSettingsButton />
        <HeaderUserMenu />
      </div>
    </header>
  );
};

export default Header;

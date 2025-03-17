
import React from 'react';
import HeaderLogo from './HeaderLogo';
import HeaderSearch from './HeaderSearch';
import HeaderNotifications from './HeaderNotifications';
import HeaderUserMenu from './HeaderUserMenu';
import HeaderSettingsButton from './HeaderSettingsButton';
import SectorSelector from './SectorSelector';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useSectorContext } from '@/hooks/useSectorContext';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user } = useAuth();
  const { selectedSector } = useSectorContext();
  
  // Determine if this is a clinical role that should prioritize sector selection
  const isClinicalRole = user?.role && ['doctor', 'nurse', 'medical_staff'].includes(user.role);
  
  return (
    <header className={cn(
      "flex h-16 items-center border-b bg-background px-4 md:px-6",
      selectedSector && "border-b-primary/10",
      className
    )}>
      <div className="flex items-center gap-2 md:gap-4">
        <HeaderLogo />
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {/* Show sector selector with visual emphasis for clinical roles */}
        <div className={cn(
          "transition-all duration-300",
          isClinicalRole && !selectedSector && "animate-pulse"
        )}>
          <SectorSelector />
        </div>
        <HeaderSearch />
        <HeaderNotifications />
        <HeaderSettingsButton />
        <HeaderUserMenu />
      </div>
    </header>
  );
};

export default Header;

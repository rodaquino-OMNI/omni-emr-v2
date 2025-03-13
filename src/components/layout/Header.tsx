
import React from "react";
import { cn } from "@/lib/utils";
import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import LanguageSwitcher from "../language/LanguageSwitcher";
import HeaderNotifications from "./HeaderNotifications";
import HeaderSettingsButton from "./HeaderSettingsButton";
import HeaderUserMenu from "./HeaderUserMenu";

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full h-16 px-6 flex items-center justify-between border-b border-border glass-morphism z-10 sticky top-0", className)}>
      <HeaderLogo />
      <HeaderSearch />
      
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <HeaderNotifications />
        <HeaderSettingsButton />
        <HeaderUserMenu />
      </div>
    </header>
  );
};

export default Header;

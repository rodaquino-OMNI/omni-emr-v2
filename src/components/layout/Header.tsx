
import React from "react";
import { Bell, Search, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../language/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className={cn("w-full h-16 px-6 flex items-center justify-between border-b border-border glass-morphism z-10 sticky top-0", className)}>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          OmniCare
        </h1>
      </div>
      
      <div className="flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder={`${t('search')} ${t('patients').toLowerCase()}, ${t('records').toLowerCase()}...`}
            className="w-full h-9 pl-10 pr-4 rounded-full bg-secondary border-none focus:ring-1 focus:ring-primary outline-none text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <button 
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center p-0">
              <User className="h-5 w-5 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user?.name || 'User'}
              <p className="text-xs font-normal text-muted-foreground">
                {user?.email || ''}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              {t('profile')}
            </DropdownMenuItem>
            {user?.role === 'admin' && (
              <DropdownMenuItem onClick={() => navigate('/admin')}>
                {t('userAdmin')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              logout();
              navigate('/login');
            }}>
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;


import React from "react";
import { Home, User, LogOut, Settings, ShieldCheck, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderUserMenu = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Only call usePermissions if user exists
  const permissions = usePermissions(user);
  
  // Only access properties if permissions exist
  const roleDisplayName = permissions?.getRoleDisplayName() || '';
  const isAdmin = user?.role === 'admin' || user?.role === 'system_administrator';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center p-0">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-9 w-9 rounded-full object-cover" 
            />
          ) : (
            <User className="h-5 w-5 text-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {user?.name || 'User'}
          <p className="text-xs font-normal text-muted-foreground">
            {roleDisplayName}
          </p>
          <p className="text-xs font-normal text-muted-foreground">
            {user?.email || ''}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <Home className="h-4 w-4 mr-2" />
          {t('dashboard')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/notifications')}>
          <Bell className="h-4 w-4 mr-2" />
          {t('notifications')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="h-4 w-4 mr-2" />
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/help')}>
          <HelpCircle className="h-4 w-4 mr-2" />
          {t('help')}
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              {t('adminPanel')}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => {
          await logout();
          navigate('/login');
        }}>
          <LogOut className="h-4 w-4 mr-2" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUserMenu;

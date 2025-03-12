
import React from "react";
import { Bell, Search, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full h-16 px-6 flex items-center justify-between border-b border-border glass-morphism z-10 sticky top-0", className)}>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          MedCare
        </h1>
      </div>
      
      <div className="flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search patients, records..."
            className="w-full h-9 pl-10 pr-4 rounded-full bg-secondary border-none focus:ring-1 focus:ring-primary outline-none text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
      </div>
    </header>
  );
};

export default Header;

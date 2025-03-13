
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export const SidebarMobileToggle = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    className="fixed left-4 top-3 z-50 lg:hidden"
    onClick={onClick}
  >
    <Menu className="h-6 w-6" />
  </Button>
);

export const SidebarCloseButton = ({ onClick }: { onClick: () => void }) => (
  <div className="absolute right-4 top-4">
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

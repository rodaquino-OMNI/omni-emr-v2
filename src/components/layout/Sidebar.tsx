
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import SidebarContent from './SidebarContent';
import { SidebarMobileToggle, SidebarCloseButton } from './SidebarToggle';

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Close the sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, isOpen]); // Added isOpen dependency
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  if (isMobile) {
    return (
      <>
        <SidebarMobileToggle onClick={toggleSidebar} />
        
        {isOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
        )}
        
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border shadow-lg transform transition-transform duration-200 ease-in-out lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarCloseButton onClick={toggleSidebar} />
          
          <div className="flex flex-col h-full pt-12">
            <SidebarContent onItemClick={toggleSidebar} />
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div className="hidden lg:flex lg:w-64 flex-col h-screen sticky top-0 border-r border-border bg-background z-10">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;

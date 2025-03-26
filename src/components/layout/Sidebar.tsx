import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import SidebarContent from './SidebarContent';
import { SidebarMobileToggle, SidebarCloseButton } from './SidebarToggle';

const Sidebar: React.FC = () => {
  // Use actual mobile detection instead of forcing mobile view
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const renderCount = useRef(0);
  
  // Debug logging to help diagnose issues
  useEffect(() => {
    renderCount.current += 1;
    console.log(`[DEBUG] Sidebar rendered ${renderCount.current} times`, { 
      isMobile, 
      isOpen,
      instanceId: Math.random().toString(36).substr(2, 9),
      renderPath: new Error().stack
    });
  }, []);
  
  // Log state changes
  useEffect(() => {
    console.log('[DEBUG] Sidebar state changed:', { isMobile, isOpen });
  }, [isMobile, isOpen]);
  
  // Close the sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, isOpen]);
  
  const toggleSidebar = () => {
    const newState = !isOpen;
    console.log('[DEBUG] Toggling sidebar from', isOpen, 'to', newState);
    setIsOpen(newState);
  };
  
  if (isMobile) {
    // Mobile sidebar implementation
    return (
      <>
        {/* Mobile toggle button */}
        <SidebarMobileToggle onClick={toggleSidebar} />
        
        {/* Backdrop overlay when sidebar is open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border shadow-lg transform transition-transform duration-200 ease-in-out",
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
  
  // Desktop sidebar implementation
  return (
    <div className="hidden lg:flex lg:w-64 flex-col h-screen sticky top-0 border-r border-border bg-background z-10">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;

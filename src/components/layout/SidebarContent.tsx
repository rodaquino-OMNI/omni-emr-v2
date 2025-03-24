import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import SidebarItem from './SidebarItem';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarLogo from './SidebarLogo';
import SidebarSectorSelector from './SidebarSectorSelector';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { sidebarItems, getSidebarItemsForRole, groupSidebarItemsByCategory, CATEGORIES } from '@/config/sidebarConfig';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarContentProps {
  onItemClick?: () => void;
}

// Category labels for display
const CATEGORY_LABELS = {
  [CATEGORIES.CLINICAL]: 'Clinical Care',
  [CATEGORIES.ADMINISTRATIVE]: 'Administrative',
  [CATEGORIES.COMMUNICATION]: 'Communication',
  [CATEGORIES.SYSTEM]: 'System',
  'other': 'Other'
};

const SidebarContent: React.FC<SidebarContentProps> = ({ onItemClick }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [CATEGORIES.CLINICAL]: true,
    [CATEGORIES.ADMINISTRATIVE]: true,
    [CATEGORIES.COMMUNICATION]: true,
    [CATEGORIES.SYSTEM]: true,
    'other': true
  });
  
  const role = user?.role || 'unauthenticated';
  
  // Mock function for function block access - in a real app, this would check actual permissions
  const hasAccessToFunctionBlock = (functionBlockId: string) => {
    // For demo purposes, assume access to all function blocks
    return true;
  };
  
  // Get filtered sidebar items for the current user's role
  const filteredItems = getSidebarItemsForRole(sidebarItems, role, hasAccessToFunctionBlock);
  
  // Group items by category
  const groupedItems = groupSidebarItemsByCategory(filteredItems);
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Check if user is a clinical role that needs sector selection
  const isClinicalRole = ['doctor', 'nurse', 'medical_staff'].includes(role);
  
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-2">
        <SidebarLogo />
      </div>
      
      {/* Profile information */}
      <div className="px-3 py-2">
        {user && <SidebarUserProfile user={user} onItemClick={onItemClick} />}
      </div>
      
      {/* Sector Selector for clinical roles */}
      {isClinicalRole && <SidebarSectorSelector />}
      
      {/* Navigation Items by Category */}
      <div className="flex-1 overflow-auto py-4">
        <TooltipProvider delayDuration={300}>
          <nav className="grid items-start px-2 text-sm font-medium gap-1">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center w-full px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  {expandedCategories[category] ? (
                    <ChevronDown className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 mr-1" />
                  )}
                  {CATEGORY_LABELS[category] || category}
                </button>
                
                {/* Category Items */}
                <div className={cn(
                  "grid gap-1 transition-all duration-200 overflow-hidden",
                  expandedCategories[category] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}>
                  <div className="min-h-0 overflow-hidden">
                    {items.map((item, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div>
                            <SidebarItem 
                              item={item}
                              onClick={onItemClick}
                            />
                          </div>
                        </TooltipTrigger>
                        {item.tooltip && (
                          <TooltipContent side="right" className="max-w-[200px]">
                            {item.tooltip}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SidebarContent;

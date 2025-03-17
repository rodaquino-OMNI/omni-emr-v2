
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { TaskFilter } from '@/services/tasks';

interface ActiveFiltersProps {
  filter: TaskFilter;
  onRemoveFilter: (key: keyof TaskFilter) => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filter, onRemoveFilter }) => {
  // Helper to render the filter badges
  const renderFilterBadges = () => {
    const badges = [];
    
    if (filter.status) {
      badges.push(
        <Badge key="status" variant="secondary" className="gap-1">
          Status: {filter.status}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onRemoveFilter('status')} 
          />
        </Badge>
      );
    }
    
    if (filter.priority) {
      badges.push(
        <Badge key="priority" variant="secondary" className="gap-1">
          Priority: {filter.priority}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onRemoveFilter('priority')} 
          />
        </Badge>
      );
    }
    
    if (filter.type) {
      badges.push(
        <Badge key="type" variant="secondary" className="gap-1">
          Type: {filter.type}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onRemoveFilter('type')} 
          />
        </Badge>
      );
    }
    
    if (filter.showDelayed) {
      badges.push(
        <Badge key="delayed" variant="secondary" className="gap-1">
          Delayed only
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onRemoveFilter('showDelayed')} 
          />
        </Badge>
      );
    }
    
    return badges;
  };
  
  const badges = renderFilterBadges();
  
  if (badges.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {badges}
    </div>
  );
};

export default ActiveFilters;

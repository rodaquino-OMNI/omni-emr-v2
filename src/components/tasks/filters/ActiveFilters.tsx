import React from 'react';
import { X } from 'lucide-react';
import { TaskFilter } from '@/services/tasks';

interface ActiveFiltersProps {
  filter: TaskFilter;
  onRemoveFilter: (key: keyof TaskFilter) => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filter, onRemoveFilter }) => {
  if (!Object.values(filter).some(value => value !== undefined)) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {filter.type && (
        <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
          Type: {filter.type}
          <button onClick={() => onRemoveFilter('type')}>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {filter.sector && (
        <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
          Sector: {filter.sector}
          <button onClick={() => onRemoveFilter('sector')}>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {filter.priority && (
        <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
          Priority: {filter.priority}
          <button onClick={() => onRemoveFilter('priority')}>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {filter.status && (
        <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
          Status: {filter.status}
          <button onClick={() => onRemoveFilter('status')}>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {filter.showDelayed && (
        <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
          Delayed only
          <button onClick={() => onRemoveFilter('showDelayed')}>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;

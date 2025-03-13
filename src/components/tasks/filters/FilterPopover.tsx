
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import TaskTypeFilter from './TaskTypeFilter';
import SectorFilter from './SectorFilter';
import PriorityFilter from './PriorityFilter';
import StatusFilter from './StatusFilter';
import DelayedFilter from './DelayedFilter';
import { TaskFilter } from '@/services/taskService';
import { TaskPriority, TaskStatus } from '../TaskCard';

interface FilterPopoverProps {
  filter: TaskFilter;
  onFilterChange: (key: keyof TaskFilter, value: any) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ filter, onFilterChange }) => {
  const { t } = useTranslation();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {t('filterBy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <TaskTypeFilter 
            value={filter.type || 'all'} 
            onChange={(value) => onFilterChange('type', value)} 
          />
          
          <SectorFilter 
            value={filter.sector || 'all'} 
            onChange={(value) => onFilterChange('sector', value)} 
          />
          
          <PriorityFilter 
            value={filter.priority || 'all'} 
            onChange={(value) => onFilterChange('priority', value as TaskPriority)} 
          />
          
          <StatusFilter 
            value={filter.status || 'all'} 
            onChange={(value) => onFilterChange('status', value as TaskStatus)} 
          />
          
          <DelayedFilter 
            checked={filter.showDelayed || false} 
            onChange={(checked) => onFilterChange('showDelayed', checked)} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;

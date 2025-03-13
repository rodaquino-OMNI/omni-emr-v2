
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TaskFilter } from '@/services/taskService';
import SearchInput from './filters/SearchInput';
import FilterPopover from './filters/FilterPopover';
import ActiveFilters from './filters/ActiveFilters';

// Interface for the filter props
interface TaskFiltersProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onSearchChange: (searchTerm: string) => void;
  searchTerm: string;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  onFilterChange,
  onSearchChange,
  searchTerm
}) => {
  const { t } = useTranslation();
  
  // Handle filter change
  const handleFilterChange = (key: keyof TaskFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value });
  };
  
  // Remove a specific filter
  const handleRemoveFilter = (key: keyof TaskFilter) => {
    const newFilter = { ...filter };
    delete newFilter[key];
    onFilterChange(newFilter);
  };
  
  // Clear all filters
  const clearFilters = () => {
    onFilterChange({});
    onSearchChange('');
  };
  
  // Check if any filter is active
  const isFilterActive = () => {
    return (
      Object.values(filter).some(value => value !== undefined) || 
      searchTerm.trim() !== ''
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <SearchInput value={searchTerm} onChange={onSearchChange} />
        
        <FilterPopover 
          filter={filter} 
          onFilterChange={handleFilterChange} 
        />
        
        {isFilterActive() && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            size="sm"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t('clearFilters')}
          </Button>
        )}
      </div>
      
      {/* Display active filters as tags */}
      {isFilterActive() && (
        <ActiveFilters filter={filter} onRemoveFilter={handleRemoveFilter} />
      )}
    </div>
  );
};

export default TaskFilters;


import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TaskFilter } from '@/types/TaskFilter';
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
    // @ts-ignore - This is safe because we're removing a property
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

  // Count active filters
  const activeFiltersCount = Object.values(filter).filter(val => val !== undefined).length + 
    (searchTerm.trim() !== '' ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <SearchInput 
          value={searchTerm} 
          onChange={onSearchChange} 
          customClassName="transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30"
        />
        
        <FilterPopover 
          filter={filter} 
          onFilterChange={handleFilterChange}
          activeFiltersCount={activeFiltersCount}
          onReset={clearFilters}
        />
        
        {isFilterActive() && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            size="sm"
            className="gap-2 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
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

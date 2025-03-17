
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskFilter } from '@/types/TaskFilter';

interface FilterPopoverProps {
  filter: TaskFilter;
  onFilterChange: (key: keyof TaskFilter, value: any) => void;
  filters?: {
    status: string;
    priority: string;
    type: string;
    searchQuery: string;
  };
  onReset?: () => void;
  activeFiltersCount?: number;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  filter,
  onFilterChange,
  filters,
  onReset,
  activeFiltersCount = 0,
}) => {
  const handleTextSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filters) {
      onFilterChange('searchTerm', e.target.value);
    }
  };

  // Default handler for backward compatibility
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      // Clear all filters if no reset handler provided
      onFilterChange('status', undefined);
      onFilterChange('priority', undefined);
      onFilterChange('type', undefined);
      onFilterChange('searchTerm', '');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed relative">
          <Filter className="mr-2 h-3.5 w-3.5" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground">
              {activeFiltersCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">Filter Tasks</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleReset}
            >
              Reset filters
              <X className="ml-1 h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters?.status || filter.status?.toString() || ''}
              onValueChange={(value) => onFilterChange('status', value === 'all' ? undefined : value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={filters?.priority || filter.priority?.toString() || ''}
              onValueChange={(value) => onFilterChange('priority', value === 'all' ? undefined : value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Task Type</Label>
            <Select
              value={filters?.type || filter.type?.toString() || ''}
              onValueChange={(value) => onFilterChange('type', value === 'all' ? undefined : value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="examination">Examination</SelectItem>
                <SelectItem value="vitals">Vitals</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="flex space-x-2">
              <Input
                id="search"
                placeholder="Search by name or description"
                value={filters?.searchQuery || filter.searchTerm || ''}
                onChange={handleTextSearch}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;

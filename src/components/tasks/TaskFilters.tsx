
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Pill, 
  FileText, 
  Stethoscope, 
  Clock,
  X,
  Filter,
  Building
} from 'lucide-react';
import { TaskFilter } from '@/services/taskService';
import { TaskPriority, TaskStatus, TaskType } from './TaskCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Interface for sectors in the hospital
interface Sector {
  id: string;
  name: string;
}

// Mock hospital sectors
const hospitalSectors: Sector[] = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'neurology', name: 'Neurology' },
  { id: 'oncology', name: 'Oncology' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'emergency', name: 'Emergency' },
  { id: 'icu', name: 'ICU' },
  { id: 'general', name: 'General' },
];

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
  
  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (key: keyof TaskFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value });
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
        <div className="relative flex-1">
          <Input
            placeholder={t('search') + '...'}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pr-8"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t('filterBy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t('taskType')}</h4>
                <Select
                  value={filter.type || 'all'}
                  onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="medication">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          <span>Medication</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="examination">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Examination</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="consultation">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>Consultation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="procedure">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>Procedure</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="followup">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Follow-up</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t('sector')}</h4>
                <Select
                  value={filter.sector || 'all'}
                  onValueChange={(value) => handleFilterChange('sector', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All sectors</SelectItem>
                      {hospitalSectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{sector.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t('priority')}</h4>
                <Select
                  value={filter.priority || 'all'}
                  onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : value as TaskPriority)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t('status')}</h4>
                <Select
                  value={filter.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value as TaskStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-delayed" 
                  checked={filter.showDelayed || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange('showDelayed', checked ? true : undefined)
                  }
                />
                <Label htmlFor="show-delayed" className="text-sm font-normal">
                  Show only delayed tasks
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
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
        <div className="flex flex-wrap gap-2">
          {filter.type && (
            <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
              Type: {filter.type}
              <button onClick={() => handleFilterChange('type', undefined)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filter.sector && (
            <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
              Sector: {filter.sector}
              <button onClick={() => handleFilterChange('sector', undefined)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filter.priority && (
            <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
              Priority: {filter.priority}
              <button onClick={() => handleFilterChange('priority', undefined)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filter.status && (
            <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
              Status: {filter.status}
              <button onClick={() => handleFilterChange('status', undefined)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filter.showDelayed && (
            <div className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-md flex items-center gap-1">
              Delayed only
              <button onClick={() => handleFilterChange('showDelayed', undefined)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;

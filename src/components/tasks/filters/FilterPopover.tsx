
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TaskFilter } from '@/services/tasks';

interface FilterPopoverProps {
  filter: TaskFilter;
  onFilterChange: (key: keyof TaskFilter, value: any) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ filter, onFilterChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Task Filters</h4>
            <p className="text-sm text-muted-foreground">
              Filter tasks by various criteria
            </p>
          </div>
          
          <div className="grid gap-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={filter.status || ''}
                onValueChange={(value) => 
                  onFilterChange('status', value ? value : undefined)
                }
                className="col-span-3"
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={filter.priority || ''}
                onValueChange={(value) => 
                  onFilterChange('priority', value ? value : undefined)
                }
                className="col-span-3"
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Any priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={filter.type || ''}
                onValueChange={(value) => 
                  onFilterChange('type', value ? value : undefined)
                }
                className="col-span-3"
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any type</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="examination">Examination</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delayed-tasks" className="text-right">
                Delayed Tasks
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="delayed-tasks"
                  checked={!!filter.showDelayed}
                  onCheckedChange={(checked) => 
                    onFilterChange('showDelayed', checked || undefined)
                  }
                />
                <Label htmlFor="delayed-tasks">Show only delayed tasks</Label>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;

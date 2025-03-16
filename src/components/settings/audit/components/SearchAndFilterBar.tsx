
import React from 'react';
import { Search, Filter, Clock, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  timeRange,
  setTimeRange,
  isFiltered,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-muted/40 rounded-lg border">
      <div className="flex-1 w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, action, resource..."
            className="pl-9 h-10 w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Time range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time period</SelectLabel>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by action" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Activity type</SelectLabel>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Logins</SelectItem>
                <SelectItem value="logout">Logouts</SelectItem>
                <SelectItem value="register">Registrations</SelectItem>
                <SelectItem value="view">View Records</SelectItem>
                <SelectItem value="create">Create Records</SelectItem>
                <SelectItem value="update">Update Records</SelectItem>
                <SelectItem value="delete">Delete Records</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full md:w-auto">
              <Settings className="h-4 w-4 mr-1" />
              Advanced Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filtering</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Filter by user role</p>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="doctor">Doctors</SelectItem>
                    <SelectItem value="nurse">Nurses</SelectItem>
                    <SelectItem value="patient">Patients</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Filter by resource type</p>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All resources</SelectItem>
                    <SelectItem value="patient">Patient records</SelectItem>
                    <SelectItem value="medication">Medications</SelectItem>
                    <SelectItem value="appointment">Appointments</SelectItem>
                    <SelectItem value="note">Clinical notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Button size="sm" className="w-full">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {isFiltered && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilterBar;

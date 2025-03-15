
import React, { useState } from 'react';
import { 
  Filter, Search, Download, Calendar, Clock, 
  ShieldAlert, User, FileText, RefreshCw, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AuditLogHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  totalLogs: number;
  isFiltered: boolean;
}

const AuditLogHeader = ({ 
  filter, 
  setFilter, 
  onExport, 
  onRefresh,
  searchTerm,
  setSearchTerm,
  totalLogs,
  isFiltered
}: AuditLogHeaderProps) => {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Security Audit Logs</h2>
          <p className="text-muted-foreground mt-1">
            HIPAA-compliant detailed record of all security-relevant activities in the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExport}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Schedule regular export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Successful Logins</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-200">142</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Failed Attempts</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-200">17</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Data Access Events</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">89</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Critical Actions</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">36</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

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
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
                setTimeRange('24h');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {totalLogs > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Showing {isFiltered ? 'filtered' : 'all'} logs - {totalLogs} {totalLogs === 1 ? 'entry' : 'entries'}
          </p>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditLogHeader;

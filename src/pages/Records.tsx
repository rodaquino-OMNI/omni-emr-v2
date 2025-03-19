import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePatientRecords } from '@/hooks/usePatientRecords';
import RecordsList from '@/components/records/RecordsList';
import NewRecordForm from '@/components/records/NewRecordForm';
import { recordService } from '@/services/recordService';
import { MedicalRecord, RecordFilters, RecordType, RecordStatus } from '@/types/medicalRecordTypes';
import { toast } from 'sonner';

const Records: React.FC = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const filters: RecordFilters = {
        searchTerm,
        typeFilter: typeFilter as RecordType | 'all',
        statusFilter: statusFilter as RecordStatus | 'all',
        dateRange: startDate ? { 
          from: startDate,
          to: endDate || new Date()
        } : undefined
      };
      
      const data = await recordService.getAllRecords(filters);
      setRecords(data);
    } catch (error) {
      toast.error('Failed to load records');
      console.error('Error loading records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [searchTerm, typeFilter, statusFilter, startDate, endDate, viewMode]);

  const handleCreateRecord = async (record: Omit<MedicalRecord, "id">) => {
    try {
      const newRecord = await recordService.createRecord(record);
      if (newRecord) {
        toast.success('Record created successfully');
        setIsNewRecordOpen(false);
        loadRecords();
      }
    } catch (error) {
      toast.error('Failed to create record');
      console.error('Error creating record:', error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const success = await recordService.deleteRecord(id);
      if (success) {
        toast.success('Record deleted successfully');
        loadRecords();
      } else {
        toast.error('Failed to delete record');
      }
    } catch (error) {
      toast.error('Error deleting record');
      console.error('Error deleting record:', error);
    }
  };

  const handleUpdateRecord = async (id: string, updates: Partial<MedicalRecord>) => {
    try {
      const updatedRecord = await recordService.updateRecord(id, updates);
      if (updatedRecord) {
        toast.success('Record updated successfully');
        loadRecords();
      } else {
        toast.error('Failed to update record');
      }
    } catch (error) {
      toast.error('Error updating record');
      console.error('Error updating record:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <Button onClick={() => setIsNewRecordOpen(true)}>New Record</Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setViewMode(value as 'all' | 'my')}>
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="my">My Records</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down your search with these filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <Input
                placeholder="Search by title or provider"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Record Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lab">Lab Result</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="visit">Visit Note</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      endDate ? (
                        <>
                          {format(startDate, 'PP')} - {format(endDate, 'PP')}
                        </>
                      ) : (
                        format(startDate, 'PP')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col space-y-2 p-2" align="start">
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <label className="text-sm">Start Date</label>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => endDate ? date > endDate : false}
                        initialFocus
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-sm">End Date</label>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => startDate ? date < startDate : false}
                        initialFocus
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }}
                      className="mr-2"
                    >
                      Clear
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setIsCalendarOpen(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          <Button onClick={loadRecords}>Apply Filters</Button>
        </CardFooter>
      </Card>

      {/* Records List with correct props */}
      <RecordsList
        records={records}
        isLoading={isLoading}
        onDelete={handleDeleteRecord}
        onUpdate={handleUpdateRecord}
      />

      {/* New Record Form with correct props */}
      {isNewRecordOpen && (
        <NewRecordForm
          onSubmit={handleCreateRecord}
          onCancel={() => setIsNewRecordOpen(false)}
        />
      )}
    </div>
  );
};

export default Records;

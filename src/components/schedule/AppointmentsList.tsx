
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import AppointmentCard from './AppointmentCard';
import { useAppointmentsQuery } from './AppointmentsList/hooks/useAppointmentsQuery';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarClock, Filter, ArrowDownUp, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type AppointmentsListProps = {
  className?: string;
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
  showControls?: boolean;
};

const AppointmentsList = ({ 
  className, 
  selectedDate, 
  patientId, 
  limit,
  showControls = true
}: AppointmentsListProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Use the custom hook for appointments querying
  const queryResult = useAppointmentsQuery({ 
    selectedDate, 
    patientId, 
    limit 
  });
  
  const { sortedAndLimitedAppointments, isLoading, error } = queryResult || { 
    sortedAndLimitedAppointments: [], 
    isLoading: false, 
    error: null 
  };

  // Filter appointments by search term and status
  const filteredAppointments = sortedAndLimitedAppointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // First sort by time
    const timeA = a.time || '';
    const timeB = b.time || '';
    const comparison = timeA.localeCompare(timeB);
    
    // Apply selected sort order
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="text-muted-foreground">
          {t('loading')}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="font-medium">{t('errorLoadingAppointments')}</p>
        <p className="text-sm mt-2 text-muted-foreground">
          {error.toString()}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showControls && sortedAndLimitedAppointments.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchAppointments') || "Search appointments..."}
              className="pl-9 h-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px] h-9">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder={t('filterByStatus') || "Filter by status"} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatus') || 'All Status'}</SelectItem>
                <SelectItem value="scheduled">{t('scheduled') || 'Scheduled'}</SelectItem>
                <SelectItem value="completed">{t('completed') || 'Completed'}</SelectItem>
                <SelectItem value="cancelled">{t('cancelled') || 'Cancelled'}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-9 gap-2"
            >
              <ArrowDownUp className="h-4 w-4" />
              {sortOrder === 'asc' 
                ? t('earliestFirst') || 'Earliest First' 
                : t('latestFirst') || 'Latest First'
              }
            </Button>
          </div>
        </div>
      )}

      {sortedAppointments.length > 0 ? (
        <div className="space-y-3 animate-fade-in">
          {sortedAppointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          
          {showControls && limit && sortedAndLimitedAppointments.length > limit && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="gap-2">
                <CalendarClock className="h-4 w-4" />
                {t('viewMoreAppointments') || 'View more appointments'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-border/50 flex flex-col items-center">
          <CalendarClock className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground font-medium">
            {selectedDate 
              ? t('noAppointmentsScheduled') 
              : patientId 
                ? t('noAppointmentsForPatient')
                : t('selectDateToViewAppointments')}
          </p>
          
          {searchTerm && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSearchTerm('')}
              className="mt-2"
            >
              {t('clearSearch') || 'Clear search'}
            </Button>
          )}
        </div>
      )}
      
      {selectedDate && sortedAppointments.length > 0 && (
        <div className="flex justify-between items-center text-sm pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {t('totalTime') || 'Total'}: {sortedAppointments.reduce((total, appointment) => 
                total + (appointment.duration || 30), 0)} {t('minutes')}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {sortedAppointments.length} {t('appointmentsShown') || 'appointments shown'}
          </span>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;

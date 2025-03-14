import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import AppointmentCard from './AppointmentCard';
import { 
  getAppointmentsByDate, 
  getAppointmentsByPatient,
  Appointment
} from '@/services/appointments';

type AppointmentsListProps = {
  className?: string;
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
};

const AppointmentsList = ({ className, selectedDate, patientId, limit }: AppointmentsListProps) => {
  const { t } = useTranslation();
  
  // Fetch appointments based on provided filters
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null, patientId],
    queryFn: async () => {
      if (patientId) {
        return getAppointmentsByPatient(patientId);
      }
      if (selectedDate) {
        return getAppointmentsByDate(format(selectedDate, 'yyyy-MM-dd'));
      }
      return [];
    },
    enabled: !!(selectedDate || patientId),
  });
  
  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => a.time.localeCompare(b.time));
  
  // Apply limit if provided
  const limitedAppointments = limit ? sortedAppointments.slice(0, limit) : sortedAppointments;

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-pulse">
        {t('loadingAppointments')}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {t('errorLoadingAppointments')}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {limitedAppointments.length > 0 ? (
        limitedAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {selectedDate 
            ? t('noAppointmentsScheduled') 
            : patientId 
              ? t('noAppointmentsForPatient')
              : t('selectDateToViewAppointments')}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;

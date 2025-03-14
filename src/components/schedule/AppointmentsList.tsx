
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import AppointmentCard from './AppointmentCard';
import { useAppointmentsQuery } from './AppointmentsList/hooks/useAppointmentsQuery';

type AppointmentsListProps = {
  className?: string;
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
};

const AppointmentsList = ({ className, selectedDate, patientId, limit }: AppointmentsListProps) => {
  const { t } = useTranslation();
  
  // Use the custom hook for appointments querying
  const { 
    sortedAndLimitedAppointments, 
    isLoading, 
    error 
  } = useAppointmentsQuery({ 
    selectedDate, 
    patientId, 
    limit 
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-pulse">
        {t('loading')}...
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
      {sortedAndLimitedAppointments.length > 0 ? (
        sortedAndLimitedAppointments.map(appointment => (
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


import React from 'react';
import { cn } from '@/lib/utils';
import { useAppointmentsQuery } from '@/components/schedule/AppointmentsList/hooks/useAppointmentsQuery';
import AppointmentsListContent from '@/components/schedule/AppointmentsList/AppointmentsListContent';

type AppointmentsListProps = {
  className?: string;
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
};

const AppointmentsList = ({ className, selectedDate, patientId, limit }: AppointmentsListProps) => {
  const { 
    appointments, 
    isLoading, 
    error, 
    sortedAndLimitedAppointments 
  } = useAppointmentsQuery({ selectedDate, patientId, limit });

  return (
    <div className={cn("space-y-3", className)}>
      <AppointmentsListContent 
        isLoading={isLoading}
        error={error}
        appointments={sortedAndLimitedAppointments}
        selectedDate={selectedDate}
        patientId={patientId}
      />
    </div>
  );
};

export default AppointmentsList;

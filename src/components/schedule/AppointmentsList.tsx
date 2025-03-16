
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
    error
  } = useAppointmentsQuery({ 
    selectedDate, 
    patientId, 
    limit 
  });

  return (
    <div className={cn("space-y-3", className)}>
      <AppointmentsListContent 
        appointments={appointments}
        selectedDate={selectedDate}
        patientId={patientId}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default AppointmentsList;

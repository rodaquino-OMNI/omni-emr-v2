
import React, { memo } from 'react';
import { Appointment } from '@/services/appointments/types';
import AppointmentCard from '@/components/schedule/AppointmentCard';
import AppointmentListLoading from './AppointmentListLoading';
import AppointmentListError from './AppointmentListError';
import AppointmentListEmpty from './AppointmentListEmpty';

type AppointmentsListContentProps = {
  isLoading: boolean;
  error: Error | null;
  appointments: Appointment[];
  selectedDate?: Date;
  patientId?: string;
};

const AppointmentsListContent: React.FC<AppointmentsListContentProps> = ({
  isLoading,
  error,
  appointments,
  selectedDate,
  patientId
}) => {
  if (isLoading) {
    return <AppointmentListLoading />;
  }

  if (error) {
    return <AppointmentListError error={error} />;
  }

  if (!appointments.length) {
    return <AppointmentListEmpty selectedDate={selectedDate} patientId={patientId} />;
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <AppointmentCard 
          key={appointment.id} 
          appointment={appointment} 
        />
      ))}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(AppointmentsListContent);

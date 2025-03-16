
import React from 'react';
import { Appointment } from './hooks/useAppointmentsQuery';
import AppointmentCard from '../AppointmentCard';
import AppointmentListEmpty from './AppointmentListEmpty';
import AppointmentListLoading from './AppointmentListLoading';
import AppointmentListError from './AppointmentListError';

type AppointmentsListContentProps = {
  appointments: Appointment[];
  selectedDate?: Date;
  patientId?: string;
  isLoading?: boolean;
  error?: Error | null;
};

const AppointmentsListContent: React.FC<AppointmentsListContentProps> = ({ 
  appointments,
  selectedDate,
  patientId,
  isLoading,
  error
}) => {
  if (isLoading) {
    return <AppointmentListLoading />;
  }

  if (error) {
    return <AppointmentListError error={error} />;
  }
  
  if (appointments.length === 0) {
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

export default AppointmentsListContent;

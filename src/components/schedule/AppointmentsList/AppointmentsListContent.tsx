
import React from 'react';
import { type Appointment } from './hooks/useAppointmentsQuery';
import AppointmentCard from '../AppointmentCard';
import AppointmentListEmpty from './AppointmentListEmpty';

type AppointmentsListContentProps = {
  appointments: Appointment[];
  selectedDate?: Date;
  patientId?: string;
};

const AppointmentsListContent: React.FC<AppointmentsListContentProps> = ({ 
  appointments,
  selectedDate,
  patientId
}) => {
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

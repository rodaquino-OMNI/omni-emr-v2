
import React from 'react';
import { useAppointmentsQuery } from './hooks/useAppointmentsQuery';
import AppointmentsListContent from './AppointmentsListContent';
import AppointmentListLoading from './AppointmentListLoading';
import AppointmentListError from './AppointmentListError';

type AppointmentsListProps = {
  selectedDate?: Date;
  patientId?: string;
  providerId?: string;
  status?: string;
};

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  selectedDate,
  patientId,
  providerId,
  status
}) => {
  const { 
    appointments, 
    isLoading, 
    error 
  } = useAppointmentsQuery(selectedDate, patientId, providerId, status);

  if (isLoading) {
    return <AppointmentListLoading />;
  }

  if (error) {
    return <AppointmentListError error={error} />;
  }

  return (
    <AppointmentsListContent 
      appointments={appointments}
      selectedDate={selectedDate}
      patientId={patientId}
    />
  );
};

export default AppointmentsList;

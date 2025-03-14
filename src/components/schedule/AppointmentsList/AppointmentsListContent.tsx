
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AppointmentCard from '../AppointmentCard';
import { Appointment } from '@/services/appointments';
import AppointmentListEmpty from './AppointmentListEmpty';
import AppointmentListLoading from './AppointmentListLoading';
import AppointmentListError from './AppointmentListError';

type AppointmentsListContentProps = {
  isLoading: boolean;
  error: unknown;
  appointments: Appointment[];
  selectedDate?: Date;
  patientId?: string;
};

const AppointmentsListContent = ({
  isLoading,
  error,
  appointments,
  selectedDate,
  patientId
}: AppointmentsListContentProps) => {
  if (isLoading) {
    return <AppointmentListLoading />;
  }

  if (error) {
    return <AppointmentListError />;
  }

  if (appointments.length === 0) {
    return <AppointmentListEmpty selectedDate={selectedDate} patientId={patientId} />;
  }

  return (
    <>
      {appointments.map(appointment => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </>
  );
};

export default AppointmentsListContent;

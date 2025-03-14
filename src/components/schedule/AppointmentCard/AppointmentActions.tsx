
import React from 'react';
import { Appointment } from '@/services/appointments';
import { useAppointmentActions } from './hooks/useAppointmentActions';
import ReminderButton from './components/ReminderButton';
import CancelButton from './components/CancelButton';
import AppointmentOptions from './components/AppointmentOptions';

type AppointmentActionsProps = {
  appointment: Appointment;
  showActions: boolean;
};

const AppointmentActions = ({ appointment, showActions }: AppointmentActionsProps) => {
  const { 
    isLoading, 
    handleSendReminder, 
    handleCompleteAppointment, 
    handleCancelAppointment 
  } = useAppointmentActions(appointment);

  if (!showActions || appointment.status !== 'scheduled') {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <ReminderButton 
        appointment={appointment} 
        isLoading={isLoading} 
        onSendReminder={handleSendReminder} 
      />
      
      <CancelButton onCancelAppointment={handleCancelAppointment} />
      
      <AppointmentOptions 
        appointment={appointment} 
        isLoading={isLoading} 
        onSendReminder={handleSendReminder} 
        onCompleteAppointment={handleCompleteAppointment} 
      />
    </div>
  );
};

export default AppointmentActions;

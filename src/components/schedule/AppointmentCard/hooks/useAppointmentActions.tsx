
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Appointment, 
  cancelAppointment, 
  completeAppointment, 
  sendAppointmentReminder 
} from '@/services/appointments';

export const useAppointmentActions = (appointment: Appointment) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendReminder = async () => {
    setIsLoading(true);
    try {
      await sendAppointmentReminder(appointment.id);
    } catch (error) {
      console.error('Error sending reminder:', error);
      // Error handling is now handled inside the service function
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteAppointment = async () => {
    setIsLoading(true);
    try {
      await completeAppointment(appointment.id);
    } catch (error) {
      console.error('Error completing appointment:', error);
      // Error handling is now handled inside the service function
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelAppointment = async () => {
    setIsLoading(true);
    try {
      await cancelAppointment(appointment.id);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Error handling is now handled inside the service function
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSendReminder,
    handleCompleteAppointment,
    handleCancelAppointment
  };
};

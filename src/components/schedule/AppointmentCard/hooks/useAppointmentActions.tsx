
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Appointment, 
  cancelAppointment, 
  completeAppointment, 
  sendAppointmentReminder 
} from '@/services/appointments';

export const useAppointmentActions = (appointment: Appointment) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendReminder = async () => {
    setIsLoading(true);
    try {
      const result = await sendAppointmentReminder(appointment.id);
      if (result) {
        toast({
          title: t('reminderSent'),
          description: t('reminderSentDescription'),
        });
      } else {
        throw new Error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: t('errorSendingReminder'),
        description: t('errorSendingReminderDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteAppointment = async () => {
    setIsLoading(true);
    try {
      const result = await completeAppointment(appointment.id);
      if (result) {
        toast({
          title: t('appointmentCompleted'),
          description: t('appointmentCompletedDescription'),
        });
      } else {
        throw new Error('Failed to complete appointment');
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast({
        title: t('errorCompletingAppointment'),
        description: t('errorCompletingAppointmentDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelAppointment = async () => {
    setIsLoading(true);
    try {
      const result = await cancelAppointment(appointment.id);
      if (result) {
        toast({
          title: t('appointmentCancelled'),
          description: t('appointmentCancelledDescription'),
        });
      } else {
        throw new Error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: t('errorCancellingAppointment'),
        description: t('errorCancellingAppointmentDescription'),
        variant: "destructive",
      });
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

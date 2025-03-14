
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
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
      const result = await sendAppointmentReminder(appointment.id);
      if (result) {
        toast.success(t('reminderSent'), {
          description: t('reminderSentDescription'),
        });
      } else {
        throw new Error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error(t('errorSendingReminder'), {
        description: t('errorSendingReminderDescription'),
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
        toast.success(t('appointmentCompleted'), {
          description: t('appointmentCompletedDescription'),
        });
      } else {
        throw new Error('Failed to complete appointment');
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error(t('errorCompletingAppointment'), {
        description: t('errorCompletingAppointmentDescription'),
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
        toast.success(t('appointmentCancelled'), {
          description: t('appointmentCancelledDescription'),
        });
      } else {
        throw new Error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(t('errorCancellingAppointment'), {
        description: t('errorCancellingAppointmentDescription'),
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


import React from 'react';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/appointments';
import { toast } from 'sonner';

interface ReminderButtonProps {
  appointment: Appointment;
  isLoading: boolean;
  onSendReminder: () => Promise<void>;
}

const ReminderButton = ({ appointment, isLoading, onSendReminder }: ReminderButtonProps) => {
  const { t } = useTranslation();
  
  const handleClick = async () => {
    try {
      await onSendReminder();
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };
  
  if (appointment.reminder_sent) {
    return null;
  }
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      disabled={isLoading}
      onClick={handleClick}
      className="h-8 w-8 p-0"
      title={t('sendReminder')}
    >
      <Bell className="h-4 w-4" />
      <span className="sr-only">{t('sendReminder')}</span>
    </Button>
  );
};

export default ReminderButton;


import React from 'react';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/appointments';

interface ReminderButtonProps {
  appointment: Appointment;
  isLoading: boolean;
  onSendReminder: () => Promise<void>;
}

const ReminderButton = ({ appointment, isLoading, onSendReminder }: ReminderButtonProps) => {
  const { t } = useTranslation();
  
  if (appointment.reminder_sent) {
    return null;
  }
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      disabled={isLoading}
      onClick={onSendReminder}
      className="h-8 w-8 p-0"
    >
      <Bell className="h-4 w-4" />
      <span className="sr-only">{t('sendReminder')}</span>
    </Button>
  );
};

export default ReminderButton;

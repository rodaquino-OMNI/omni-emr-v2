
import React from 'react';
import { Bell, CheckCircle, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Appointment } from '@/services/appointments';

type AppointmentStatusProps = {
  appointment: Appointment;
};

const AppointmentStatus = ({ appointment }: AppointmentStatusProps) => {
  const { t } = useTranslation();
  
  if (appointment.status === 'completed') {
    return (
      <div className="mt-2 bg-green-50 text-green-700 text-sm p-2 rounded-md flex items-center gap-1.5">
        <CheckCircle className="h-4 w-4" />
        <span>{t('appointmentCompleted')}</span>
      </div>
    );
  }
  
  if (appointment.status === 'cancelled') {
    return (
      <div className="mt-2 bg-gray-50 text-gray-700 text-sm p-2 rounded-md flex items-center gap-1.5">
        <X className="h-4 w-4" />
        <span>{t('appointmentCancelled')}</span>
      </div>
    );
  }
  
  if (appointment.reminder_sent && appointment.status === 'scheduled') {
    return (
      <div className="mt-2 bg-blue-50 text-blue-700 text-sm p-2 rounded-md flex items-center gap-1.5">
        <Bell className="h-4 w-4" />
        <span>{t('reminderSent')}</span>
      </div>
    );
  }
  
  return null;
};

export default AppointmentStatus;

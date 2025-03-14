
import React from 'react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/services/appointments';

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-500';
    case 'completed':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-gray-400';
    case 'no-show':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};

type AppointmentStatusBadgeProps = {
  status: Appointment['status'];
  className?: string;
};

const AppointmentStatusBadge = ({ status, className }: AppointmentStatusBadgeProps) => {
  return (
    <div className={cn("h-2 w-2 rounded-full", getStatusColor(status), className)}></div>
  );
};

export default AppointmentStatusBadge;

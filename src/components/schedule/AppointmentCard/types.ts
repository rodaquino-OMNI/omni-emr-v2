
import { Appointment } from '@/services/appointments';

export type AppointmentCardProps = {
  appointment: Appointment;
  className?: string;
  showActions?: boolean;
};

export type AppointmentStatusColor = {
  [key in Appointment['status']]: string;
};

export type AppointmentTypeInfo = {
  icon: JSX.Element;
  label: string;
};

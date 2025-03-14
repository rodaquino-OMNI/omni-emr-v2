
import { Appointment } from '@/services/appointments';

/**
 * Sorts appointments by time in ascending order
 */
export const sortAppointmentsByTime = (appointments: Appointment[]): Appointment[] => {
  return [...appointments].sort((a, b) => a.time.localeCompare(b.time));
};

/**
 * Limits the number of appointments to the specified limit
 */
export const limitAppointments = (
  appointments: Appointment[], 
  limit?: number
): Appointment[] => {
  if (!limit) return appointments;
  return appointments.slice(0, limit);
};

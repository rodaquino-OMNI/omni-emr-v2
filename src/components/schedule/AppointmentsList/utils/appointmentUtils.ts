
import { Appointment } from '@/services/appointments';

/**
 * Sorts appointments by time in ascending order
 */
export const sortAppointmentsByTime = (appointments: Appointment[] = []): Appointment[] => {
  if (!appointments || !Array.isArray(appointments)) {
    return [];
  }
  return [...appointments].sort((a, b) => {
    if (!a.time) return -1;
    if (!b.time) return 1;
    return a.time.localeCompare(b.time);
  });
};

/**
 * Limits the number of appointments if a limit is provided
 */
export const limitAppointments = (
  appointments: Appointment[] = [], 
  limit?: number
): Appointment[] => {
  if (!appointments || !Array.isArray(appointments)) {
    return [];
  }
  if (!limit) return appointments;
  return appointments.slice(0, limit);
};

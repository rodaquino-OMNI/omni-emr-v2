
import { Appointment } from '@/services/appointments';

/**
 * Sorts appointments by time
 */
export const sortAppointmentsByTime = (appointments: Appointment[]): Appointment[] => {
  return [...appointments].sort((a, b) => {
    // First sort by date
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    // Then sort by time
    return a.time.localeCompare(b.time);
  });
};

/**
 * Limits the number of appointments returned
 */
export const limitAppointments = (appointments: Appointment[], limit?: number): Appointment[] => {
  if (!limit || limit <= 0 || appointments.length <= limit) {
    return appointments;
  }
  
  return appointments.slice(0, limit);
};

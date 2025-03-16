
import { Appointment } from '../types';

// Add any additional typing needed for the database format
type DbAppointment = any;

/**
 * Map a database appointment record to our application model
 */
export const mapDbAppointmentToAppointment = (data: DbAppointment): Appointment => {
  return data as Appointment; // For now, using simple type assertion
};

/**
 * Map our application model to database format for inserts/updates
 */
export const mapAppointmentToDbFormat = (appointment: Partial<Appointment>): Record<string, any> => {
  return appointment as Record<string, any>; // For now, using simple type assertion
};

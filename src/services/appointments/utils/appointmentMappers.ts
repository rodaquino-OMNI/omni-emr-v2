
import { Appointment, AppointmentStatus, AppointmentType } from '../types';

/**
 * Maps a database appointment row to the Appointment type
 */
export const mapDbAppointmentToAppointment = (row: any): Appointment => ({
  id: row.id,
  patientId: row.patient_id,
  patientName: row.patient_name,
  providerId: row.provider_id,
  providerName: row.provider_name,
  title: row.title,
  notes: row.notes,
  date: row.date,
  time: row.time,
  duration: row.duration,
  location: row.location,
  type: row.type as AppointmentType,
  status: row.status as AppointmentStatus,
  reminder_sent: row.reminder_sent,
  created_at: row.created_at,
  updated_at: row.updated_at
});

/**
 * Maps an Appointment to database format for insert/update operations
 */
export const mapAppointmentToDbFormat = (appointment: Partial<Appointment>): Record<string, any> => {
  const dbAppointment: Record<string, any> = {};
  
  if (appointment.patientId !== undefined) {
    dbAppointment.patient_id = appointment.patientId;
  }
  
  if (appointment.patientName !== undefined) {
    dbAppointment.patient_name = appointment.patientName;
  }
  
  if (appointment.providerId !== undefined) {
    dbAppointment.provider_id = appointment.providerId;
  }
  
  if (appointment.providerName !== undefined) {
    dbAppointment.provider_name = appointment.providerName;
  }
  
  // Direct mappings (same field names)
  ['title', 'notes', 'date', 'time', 'duration', 'location', 'type', 'status'].forEach(field => {
    if (appointment[field as keyof Appointment] !== undefined) {
      dbAppointment[field] = appointment[field as keyof Appointment];
    }
  });
  
  // Handle reminder_sent separately since it has an underscore
  if (appointment.reminder_sent !== undefined) {
    dbAppointment.reminder_sent = appointment.reminder_sent;
  }
  
  // Remove created_at and updated_at if present
  delete dbAppointment.created_at;
  delete dbAppointment.updated_at;
  
  return dbAppointment;
};

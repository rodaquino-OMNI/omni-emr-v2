
import { Appointment, AppointmentStatus, AppointmentType } from '../types';
import { Database } from '@/integrations/supabase/types';

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
  updated_at: row.updated_at,
  // Add support for new columns - match them to actual database fields
  category: row.category,
  is_telehealth: row.is_telehealth,
  reminder_time: row.reminder_time,
  created_by: row.created_by
});

// Update the Database type declaration to include only the fields that exist in the database
type AppointmentInsert = {
  id?: string;
  patient_id: string;
  patient_name: string;
  provider_id: string;
  provider_name: string;
  title: string;
  notes?: string;
  date: string;
  time: string;
  duration: number;
  location?: string;
  type: string;
  status: string;
  reminder_sent?: boolean;
  created_at?: string;
  updated_at?: string;
  // Match these fields to the actual columns in the database
  category?: string;
  is_telehealth?: boolean;
  reminder_time?: string;
  created_by?: string;
};

/**
 * Maps an Appointment to database format for insert/update operations
 * using the correct Supabase types
 */
export const mapAppointmentToDbFormat = (
  appointment: Partial<Appointment>
): Partial<AppointmentInsert> => {
  const dbAppointment: Partial<AppointmentInsert> = {};

  // Only add fields that are present in the appointment object
  if (appointment.date !== undefined) dbAppointment.date = appointment.date;
  if (appointment.duration !== undefined) dbAppointment.duration = appointment.duration;
  if (appointment.patientId !== undefined) dbAppointment.patient_id = appointment.patientId;
  if (appointment.patientName !== undefined) dbAppointment.patient_name = appointment.patientName;
  if (appointment.providerId !== undefined) dbAppointment.provider_id = appointment.providerId;
  if (appointment.providerName !== undefined) dbAppointment.provider_name = appointment.providerName;
  if (appointment.title !== undefined) dbAppointment.title = appointment.title;
  if (appointment.time !== undefined) dbAppointment.time = appointment.time;
  if (appointment.type !== undefined) dbAppointment.type = appointment.type;
  if (appointment.status !== undefined) dbAppointment.status = appointment.status;
  
  // Optional fields
  if (appointment.notes !== undefined) {
    dbAppointment.notes = appointment.notes;
  }
  
  if (appointment.location !== undefined) {
    dbAppointment.location = appointment.location;
  }
  
  if (appointment.reminder_sent !== undefined) {
    dbAppointment.reminder_sent = appointment.reminder_sent;
  }
  
  // Add new fields (only if they actually exist in the database)
  if (appointment.category !== undefined) {
    dbAppointment.category = appointment.category;
  }
  
  if (appointment.is_telehealth !== undefined) {
    dbAppointment.is_telehealth = appointment.is_telehealth;
  }
  
  if (appointment.reminder_time !== undefined) {
    dbAppointment.reminder_time = appointment.reminder_time;
  }
  
  if (appointment.created_by !== undefined) {
    dbAppointment.created_by = appointment.created_by;
  }
  
  return dbAppointment;
};

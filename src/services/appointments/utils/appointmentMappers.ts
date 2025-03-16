
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
  // Add support for new columns
  category: row.category,
  is_telehealth: row.is_telehealth,
  reminder_time: row.reminder_time,
  created_by: row.created_by
});

/**
 * Maps an Appointment to database format for insert/update operations
 * using the correct Supabase types
 */
export const mapAppointmentToDbFormat = (
  appointment: Partial<Appointment>
): Database['public']['Tables']['appointments']['Insert'] => {
  const dbAppointment: Database['public']['Tables']['appointments']['Insert'] = {
    date: appointment.date || new Date().toISOString().split('T')[0],
    duration: appointment.duration || 30,
    patient_id: appointment.patientId || '',
    patient_name: appointment.patientName || '',
    provider_id: appointment.providerId || '',
    provider_name: appointment.providerName || '',
    title: appointment.title || '',
    time: appointment.time || '',
    type: appointment.type || 'in-person',
    status: appointment.status || 'scheduled',
  };
  
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
  
  // Add new fields
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

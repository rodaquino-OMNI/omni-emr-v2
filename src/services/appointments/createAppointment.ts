
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment, mapAppointmentToDbFormat } from './utils/appointmentMappers';
import { handleAppointmentError } from './utils/errorHandling';

/**
 * Create a new appointment
 */
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  try {
    // Prepare data for Supabase insert using the properly typed mapper
    const appointmentData = mapAppointmentToDbFormat(appointment);
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map the returned data back to our Appointment type
    const result = mapDbAppointmentToAppointment(data);
    
    // Log the action - perform this asynchronously without awaiting
    logAuditEvent(
      appointment.providerId,
      'create',
      'appointment',
      result.id,
      { patientId: appointment.patientId }
    ).catch(err => console.error('Failed to log audit event:', err));
    
    return result;
  } catch (error) {
    // Create a single fallback mock appointment object
    const now = new Date().toISOString();
    const mockAppointment: Appointment = {
      ...appointment,
      id: `app-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    
    // Handle the error and return the mock appointment if in dev mode
    const result = await handleAppointmentError(
      error,
      {
        operation: 'create',
        entityType: 'appointment',
        providerId: appointment.providerId,
        patientId: appointment.patientId
      },
      () => {
        mockAppointments.push(mockAppointment);
        return mockAppointment;
      }
    );
    
    return result as Appointment;
  }
};

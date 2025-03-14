
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment, mapAppointmentToDbFormat } from './utils/appointmentMappers';

/**
 * Create a new appointment
 */
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  try {
    // Prepare data for Supabase insert
    const appointmentData = mapAppointmentToDbFormat(appointment);
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      // Fall back to mock data approach
      const now = new Date().toISOString();
      const newAppointment: Appointment = {
        ...appointment,
        id: `app-${Date.now()}`,
        created_at: now,
        updated_at: now
      };
      
      mockAppointments.push(newAppointment);
      
      // Log the action
      await logAuditEvent(
        appointment.providerId,
        'create',
        'appointment',
        newAppointment.id,
        { patientId: appointment.patientId }
      );
      
      return newAppointment;
    }
    
    // Map the returned data back to our Appointment type
    const result = mapDbAppointmentToAppointment(data);
    
    // Log the action
    await logAuditEvent(
      appointment.providerId,
      'create',
      'appointment',
      result.id,
      { patientId: appointment.patientId }
    );
    
    return result;
  } catch (error) {
    console.error('Exception creating appointment:', error);
    
    // Fall back to mock data approach
    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      ...appointment,
      id: `app-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    
    mockAppointments.push(newAppointment);
    
    // Log the action
    await logAuditEvent(
      appointment.providerId,
      'create',
      'appointment',
      newAppointment.id,
      { patientId: appointment.patientId }
    );
    
    return newAppointment;
  }
};

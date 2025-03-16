
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment, mapAppointmentToDbFormat } from './utils/appointmentMappers';
import { handleAppointmentError } from './utils/errorHandling';

/**
 * Update an appointment
 */
export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    // Convert from our API format to database format with correct typing
    const dbUpdates = mapAppointmentToDbFormat(updates);
    
    const { data, error } = await supabase
      .from('appointments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map the returned data back to our Appointment type
    const result = mapDbAppointmentToAppointment(data);
    
    // Log the action - perform this asynchronously without awaiting
    logAuditEvent(
      result.providerId,
      'update',
      'appointment',
      id,
      { patientId: result.patientId, updates }
    ).catch(err => console.error('Failed to log audit event:', err));
    
    return result;
  } catch (error) {
    // Find the appointment to update in mock data
    const index = mockAppointments.findIndex(a => a.id === id);
    
    // If appointment not found, return null
    if (index === -1) {
      return null;
    }
    
    // Create a single updated mock appointment object
    const updatedAppointment = {
      ...mockAppointments[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Handle the error and return the updated mock appointment if in dev mode
    const result = await handleAppointmentError(
      error,
      {
        operation: 'update',
        entityType: 'appointment',
        entityId: id,
        providerId: updatedAppointment.providerId,
        patientId: updatedAppointment.patientId,
        updates
      },
      () => {
        mockAppointments[index] = updatedAppointment;
        return updatedAppointment;
      }
    );
    
    return result as Appointment | null;
  }
};

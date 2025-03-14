
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment, mapAppointmentToDbFormat } from './utils/appointmentMappers';

/**
 * Update an appointment
 */
export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    // Convert from our API format to database format
    const dbUpdates = mapAppointmentToDbFormat(updates);
    
    const { data, error } = await supabase
      .from('appointments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment:', error);
      
      // Fall back to mock data
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index >= 0) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        // Log the action
        await logAuditEvent(
          mockAppointments[index].providerId,
          'update',
          'appointment',
          id,
          { patientId: mockAppointments[index].patientId, updates }
        );
        
        return mockAppointments[index];
      }
      
      return null;
    }
    
    // Map the returned data back to our Appointment type
    const result = mapDbAppointmentToAppointment(data);
    
    // Log the action
    await logAuditEvent(
      result.providerId,
      'update',
      'appointment',
      id,
      { patientId: result.patientId, updates }
    );
    
    return result;
  } catch (error) {
    console.error('Exception updating appointment:', error);
    
    // Update in mock data
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index >= 0) {
      mockAppointments[index] = {
        ...mockAppointments[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Log the action
      await logAuditEvent(
        mockAppointments[index].providerId,
        'update',
        'appointment',
        id,
        { patientId: mockAppointments[index].patientId, updates }
      );
      
      return mockAppointments[index];
    }
    
    return null;
  }
};

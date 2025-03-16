
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment, mapAppointmentToDbFormat } from './utils/appointmentMappers';
import { handleServiceError, handleServiceSuccess } from './utils/standardErrorHandler';

type AppointmentUpdateResponse = {
  success: boolean;
  data?: Appointment | null;
  error?: Error;
};

/**
 * Update an appointment with standardized error handling
 */
export const updateAppointment = async (
  id: string, 
  updates: Partial<Appointment>
): Promise<AppointmentUpdateResponse> => {
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
    
    // Return success with standardized format
    return handleServiceSuccess(result, {
      userId: result.providerId,
      operation: 'update',
      entityType: 'appointment',
      entityId: id,
      patientId: result.patientId,
      details: { updates }
    });
  } catch (error) {
    // Define a fallback function that uses mock data in development
    const createFallbackAppointment = () => {
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
      
      // Update the mock appointments array
      mockAppointments[index] = updatedAppointment;
      
      return updatedAppointment;
    };
    
    // Handle the error with standardized format
    return handleServiceError(
      error,
      {
        userId: updates.providerId,
        operation: 'update',
        entityType: 'appointment',
        entityId: id,
        patientId: updates.patientId,
        showToast: true
      },
      createFallbackAppointment
    );
  }
};

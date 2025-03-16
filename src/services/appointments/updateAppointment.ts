
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
    // Validate input parameters
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }

    if (!updates || typeof updates !== 'object') {
      throw new Error('Invalid updates object provided');
    }

    // Convert from our API format to database format with correct typing
    const dbUpdates = mapAppointmentToDbFormat(updates);
    
    // Ensure we have valid updates
    if (Object.keys(dbUpdates).length === 0) {
      throw new Error('No valid updates provided');
    }

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
      // Validate ID before using it to find the appointment
      if (!id || typeof id !== 'string') {
        return null;
      }

      // Find the appointment to update in mock data
      const index = mockAppointments.findIndex(a => a.id === id);
      
      // If appointment not found, return null
      if (index === -1) {
        return null;
      }
      
      // Create a single updated mock appointment object with type safety
      const validUpdates = { ...updates };
      const updatedAppointment = {
        ...mockAppointments[index],
        ...validUpdates,
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

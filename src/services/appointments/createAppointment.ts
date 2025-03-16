
import { supabase } from '@/integrations/supabase/core';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment, mapAppointmentToDbFormat } from './utils/appointmentMappers';
import { handleServiceError, handleServiceSuccess } from './utils/standardErrorHandler';

type AppointmentCreationResponse = { 
  success: boolean; 
  data?: Appointment; 
  error?: Error;
};

/**
 * Create a new appointment with standardized error handling
 */
export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
): Promise<AppointmentCreationResponse> => {
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
    
    // Return success with standardized format
    return handleServiceSuccess(result, {
      userId: appointment.providerId,
      operation: 'create',
      entityType: 'appointment',
      entityId: result.id,
      patientId: appointment.patientId
    });
  } catch (error) {
    // Create a fallback mock appointment for development mode
    const createMockAppointment = () => {
      const now = new Date().toISOString();
      const mockAppointment: Appointment = {
        ...appointment,
        id: `app-${Date.now()}`,
        created_at: now,
        updated_at: now
      };
      
      mockAppointments.push(mockAppointment);
      return mockAppointment;
    };
    
    // Handle error with standardized format
    return handleServiceError(
      error,
      {
        userId: appointment.providerId,
        operation: 'create',
        entityType: 'appointment',
        patientId: appointment.patientId,
        showToast: true
      },
      createMockAppointment
    );
  }
};

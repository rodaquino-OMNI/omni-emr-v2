import { supabase } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { mockAppointments } from './mockData';
import { mapDbAppointmentToAppointment } from './utils/appointmentMappers';
import { handleAppointmentError } from './utils/errorHandling';

interface QueryOptions {
  column: string;
  ascending: boolean;
}

/**
 * Base function to handle appointment fetching with various filters
 */
const getAppointmentsBase = async (
  filters: Record<string, any> = {},
  orderColumns: QueryOptions[] = [{column: 'date', ascending: true}]
): Promise<Appointment[]> => {
  try {
    let query = supabase.from('appointments').select('*');
    
    // Apply all filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    
    // Apply all ordering
    orderColumns.forEach(({column, ascending}) => {
      query = query.order(column, { ascending });
    });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Map the database fields to our Appointment type
    return data.map(mapDbAppointmentToAppointment);
  } catch (error) {
    // Generate mock fallback data based on filters
    const mockData = mockAppointments.filter(appointment => {
      return Object.entries(filters).every(([key, value]) => {
        // Handle snake_case to camelCase conversion (e.g. patient_id → patientId)
        const camelKey = key.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
        return appointment[camelKey as keyof Appointment] === value;
      });
    });
    
    // Handle the error and return the mock data if in dev mode
    return handleAppointmentError(error, {
      operation: 'fetch',
      entityType: 'appointment'
    }, () => mockData) as Appointment[];
  }
};

/**
 * Get all appointments
 */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  return await getAppointmentsBase();
};

/**
 * Get appointments by date
 */
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  return await getAppointmentsBase(
    { date },
    [
      { column: 'time', ascending: true }
    ]
  );
};

/**
 * Get appointments by patient ID
 */
export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  return await getAppointmentsBase(
    { patient_id: patientId },
    [
      { column: 'date', ascending: true },
      { column: 'time', ascending: true }
    ]
  );
};

/**
 * Get appointments by provider ID
 */
export const getAppointmentsByProvider = async (providerId: string): Promise<Appointment[]> => {
  return await getAppointmentsBase(
    { provider_id: providerId },
    [
      { column: 'date', ascending: true },
      { column: 'time', ascending: true }
    ]
  );
};

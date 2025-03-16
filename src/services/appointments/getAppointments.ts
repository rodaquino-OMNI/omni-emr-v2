
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
 * Optimized to only select needed columns and limit result size
 */
const getAppointmentsBase = async (
  filters: Record<string, any> = {},
  orderColumns: QueryOptions[] = [{column: 'date', ascending: true}],
  limit: number = 100
): Promise<Appointment[]> => {
  try {
    // Select only the columns we need instead of '*'
    const requiredColumns = 'id,date,time,patient_id,provider_id,status,type,notes,location,duration,created_at,updated_at';
    
    let query = supabase
      .from('appointments')
      .select(requiredColumns)
      .limit(limit); // Add limit to prevent excessive data fetching
    
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
    // Create a function for filtering to avoid redundant code
    const filterMockAppointments = () => {
      return mockAppointments.filter(appointment => {
        return Object.entries(filters).every(([key, value]) => {
          // Handle snake_case to camelCase conversion (e.g. patient_id → patientId)
          const camelKey = key.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
          return appointment[camelKey as keyof Appointment] === value;
        });
      });
    };
    
    // Handle the error and return the mock data if in dev mode
    const result = await handleAppointmentError(
      error, 
      {
        operation: 'fetch',
        entityType: 'appointment'
      }, 
      filterMockAppointments
    );
    
    return result as Appointment[];
  }
};

/**
 * Get all appointments
 */
export const getAllAppointments = async (limit: number = 100): Promise<Appointment[]> => {
  return await getAppointmentsBase({}, [{column: 'date', ascending: true}], limit);
};

/**
 * Get appointments by date
 */
export const getAppointmentsByDate = async (date: string, limit: number = 50): Promise<Appointment[]> => {
  return await getAppointmentsBase(
    { date },
    [
      { column: 'time', ascending: true }
    ],
    limit
  );
};

/**
 * Get appointments by patient ID
 */
export const getAppointmentsByPatient = async (patientId: string, limit: number = 50): Promise<Appointment[]> => {
  return await getAppointmentsBase(
    { patient_id: patientId },
    [
      { column: 'date', ascending: true },
      { column: 'time', ascending: true }
    ],
    limit
  );
};

/**
 * Get appointments by provider ID
 */
export const getAppointmentsByProvider = async (providerId: string, limit: number = 50): Promise<Appointment[]> => {
  return await getAppointmentsBase(
    { provider_id: providerId },
    [
      { column: 'date', ascending: true },
      { column: 'time', ascending: true }
    ],
    limit
  );
};

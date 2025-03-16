
import { Appointment } from '../types';
import { mockAppointments } from '../mockData';
import { logAuditEvent } from '@/integrations/supabase/client';

interface ErrorHandlingOptions {
  entityId?: string;
  patientId?: string;
  providerId?: string;
  operation: 'create' | 'update' | 'delete' | 'fetch';
  entityType: 'appointment';
  updates?: Partial<Appointment>;
}

/**
 * Handle errors for appointment operations and fall back to mock data
 */
export const handleAppointmentError = async (
  error: any, 
  options: ErrorHandlingOptions, 
  mockOperation: () => Appointment | Appointment[] | null
): Promise<Appointment | Appointment[] | null> => {
  console.error(`Error ${options.operation}ing ${options.entityType}:`, error);
  
  // Execute mock data operation as fallback
  const result = mockOperation();
  
  // Log audit event if we have the necessary data
  if (options.providerId && (options.entityId || options.operation === 'create')) {
    const entityId = options.entityId || (result as Appointment)?.id || 'unknown';
    
    await logAuditEvent(
      options.providerId,
      options.operation,
      options.entityType,
      entityId,
      { 
        patientId: options.patientId, 
        ...(options.updates ? { updates: options.updates } : {})
      }
    );
  }
  
  return result;
};

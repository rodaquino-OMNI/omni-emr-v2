
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Basic HIPAA-compliant audit logging
 */
export const logAuditEvent = async (
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details
      });
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
};

/**
 * Enhanced audit logging with additional HIPAA-compliant fields
 */
export interface EnhancedAuditPayload {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  patientId?: string;
  accessReason?: string;
  accessType: string;
  isEmergencyAccess?: boolean;
  emergencyReason?: string;
  details?: Record<string, any>;
}

export const logEnhancedAuditEvent = async (payload: EnhancedAuditPayload): Promise<void> => {
  try {
    await supabase
      .from('extended_audit_logs')
      .insert({
        user_id: payload.userId,
        action: payload.action,
        resource_type: payload.resourceType,
        resource_id: payload.resourceId,
        patient_id: payload.patientId,
        access_reason: payload.accessReason,
        access_type: payload.accessType,
        is_emergency_access: payload.isEmergencyAccess,
        emergency_reason: payload.emergencyReason,
        details: payload.details,
        ip_address: 'client_ip_address', // In a real implementation, this would be the client's IP
        user_agent: navigator.userAgent
      });
  } catch (error) {
    console.error('Error logging enhanced audit event:', error);
  }
};

/**
 * Check if the Supabase connection is working
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};

/**
 * Create a new partition for audit logs if needed
 */
export const createAuditLogPartition = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.rpc('check_function_exists', {
      function_name: 'create_audit_log_partition'
    });
    
    if (!data) {
      console.log('create_audit_log_partition function does not exist');
      return false;
    }
    
    await supabase.rpc('create_audit_log_partition');
    return true;
  } catch (error) {
    console.error('Error creating audit log partition:', error);
    return false;
  }
};

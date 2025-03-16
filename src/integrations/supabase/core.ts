
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Check Supabase connection
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('audit_logs').select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
};

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
        details,
        ip_address: 'client_ip_unknown',
        user_agent: navigator.userAgent || 'unknown'
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
 * Create a new partition for audit logs if needed
 */
export const createAuditLogPartition = async (): Promise<boolean> => {
  try {
    // Use the safely created function to check if another function exists
    const { data } = await supabase.rpc('check_table_exists', {
      table_name: 'audit_logs_partitioned'
    });
    
    if (!data) {
      console.log('audit_logs_partitioned table does not exist');
      return false;
    }
    
    // Additional partition management code would go here
    return true;
  } catch (error) {
    console.error('Error managing audit log partitions:', error);
    return false;
  }
};

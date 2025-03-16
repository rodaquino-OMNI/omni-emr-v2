
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
      .from('extended_audit_logs' as any)
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
 * Get query performance statistics
 */
export const getQueryPerformanceStats = async (minExecutionTime = 100, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('query_performance_logs' as any)
      .select('*')
      .gte('execution_time', minExecutionTime)
      .order('execution_time', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting query performance stats:', error);
    return [];
  }
};

/**
 * Check if a user has a specific permission
 */
export const userHasPermission = async (userId: string, permissionCode: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'user_has_permission' as any, 
      {
        p_user_id: userId,
        p_permission_code: permissionCode
      }
    );
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
};

/**
 * Log slow query for performance monitoring
 */
export const logSlowQuery = async (
  queryText: string,
  executionTime: number,
  rowsReturned: number,
  queryPlan: any,
  thresholdMs = 100
): Promise<void> => {
  try {
    if (executionTime < thresholdMs) return;
    
    await supabase
      .from('query_performance_logs' as any)
      .insert({
        query_text: queryText,
        execution_time: executionTime,
        rows_returned: rowsReturned,
        query_plan: queryPlan
      });
  } catch (error) {
    console.error('Error logging slow query:', error);
  }
};

/**
 * Refresh a materialized view
 */
export const refreshMaterializedView = async (viewName: string): Promise<boolean> => {
  try {
    await supabase.rpc('refresh_materialized_view' as any, {
      view_name: viewName
    });
    return true;
  } catch (error) {
    console.error(`Error refreshing materialized view ${viewName}:`, error);
    return false;
  }
};

/**
 * Check Supabase connection
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('audit_logs').select('count(*)', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
};

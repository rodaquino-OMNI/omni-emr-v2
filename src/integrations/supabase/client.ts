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
    // Check if performance monitoring table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('pg_tables')
      .select('exists')
      .eq('schemaname', 'public')
      .eq('tablename', 'query_performance_logs')
      .single();
    
    if (tableError || !tableExists || !tableExists.exists) {
      console.error('Performance logs table does not exist');
      return [];
    }
    
    const { data, error } = await supabase
      .from('query_performance_logs')
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
    // Check if the function exists
    const { data: functionExists, error: functionError } = await supabase
      .from('pg_proc')
      .select('exists')
      .eq('proname', 'user_has_permission')
      .single();
    
    if (functionError || !functionExists || !functionExists.exists) {
      console.error('user_has_permission function does not exist');
      // Fallback to a simpler check
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      // Simplified permission check based on role
      const userRole = userData?.role;
      if (userRole === 'admin') return true;
      if (permissionCode.includes('read') && ['doctor', 'nurse'].includes(userRole)) return true;
      if (permissionCode.includes('write') && userRole === 'doctor') return true;
      
      return false;
    }
    
    // If function exists, use it
    const { data, error } = await supabase.rpc(
      'user_has_permission', 
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
    
    // Check if the table exists first
    const { data: tableExists, error: tableError } = await supabase.query(`
      SELECT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'query_performance_logs'
      ) as exists
    `);
    
    if (tableError || !tableExists || !tableExists[0]?.exists) {
      console.log('Performance logs table does not exist - skipping logging');
      return;
    }
    
    await supabase
      .from('query_performance_logs')
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
    // First check if the view exists
    const { data: viewExists, error: viewError } = await supabase
      .from('pg_class')
      .select('exists')
      .eq('relname', viewName)
      .eq('relkind', 'm')
      .single();
    
    if (viewError || !viewExists || !viewExists.exists) {
      console.error(`Materialized view ${viewName} does not exist`);
      return false;
    }
    
    // Check if the refresh function exists
    const { data: functionExists, error: functionError } = await supabase
      .from('pg_proc')
      .select('exists')
      .eq('proname', 'refresh_materialized_view')
      .single();
    
    if (functionError || !functionExists || !functionExists.exists) {
      console.error('refresh_materialized_view function does not exist');
      
      // Try a direct refresh
      try {
        await supabase.rpc('refresh_materialized_view', { view_name: viewName });
        return true;
      } catch (directError) {
        console.error(`Error directly refreshing materialized view ${viewName}:`, directError);
        return false;
      }
    }
    
    // Use the function if it exists
    await supabase.rpc('refresh_materialized_view', {
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

/**
 * Create a new partition for audit logs if needed
 */
export const createAuditLogPartition = async (): Promise<boolean> => {
  try {
    // Check if the function exists
    const { data: functionExists, error: functionError } = await supabase
      .from('pg_proc')
      .select('exists')
      .eq('proname', 'create_audit_log_partition')
      .single();
    
    if (functionError || !functionExists || !functionExists.exists) {
      console.log('create_audit_log_partition function does not exist');
      return false;
    }
    
    // Call the function
    await supabase.rpc('create_audit_log_partition');
    return true;
  } catch (error) {
    console.error('Error creating audit log partition:', error);
    return false;
  }
};

/**
 * Safe method to execute a database maintenance function
 */
export const safeExecuteMaintenanceFunction = async (functionName: string, params: any = {}): Promise<any> => {
  try {
    // Check if the function exists
    const { data: functionExists, error: functionError } = await supabase.query(`
      SELECT EXISTS (
        SELECT 1
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = '${functionName}'
        AND n.nspname = 'public'
      ) as exists
    `);
    
    if (functionError || !functionExists || !functionExists[0]?.exists) {
      console.log(`Maintenance function ${functionName} does not exist`);
      return null;
    }
    
    // Call the function
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error executing ${functionName}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in safeExecuteMaintenanceFunction for ${functionName}:`, error);
    return null;
  }
};

/**
 * Get performance monitoring statistics
 */
export const getPerformanceStatistics = async (): Promise<any> => {
  try {
    // Check if the view exists
    const { data: viewExists, error: viewError } = await supabase
      .from('pg_class')
      .select('exists')
      .eq('relname', 'performance_statistics')
      .eq('relkind', 'v')
      .single();
    
    if (viewError || !viewExists || !viewExists.exists) {
      console.log('performance_statistics view does not exist');
      return null;
    }
    
    // Query the view
    const { data, error } = await supabase
      .from('performance_statistics')
      .select('*')
      .single();
      
    if (error) {
      console.error('Error querying performance statistics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPerformanceStatistics:', error);
    return null;
  }
};


import { createClient } from '@supabase/supabase-js';
import { isMockMode, mockSupabase } from '../../services/mockService';

// Check if we're in mock mode
const MOCK_MODE = isMockMode || import.meta.env.VITE_MOCK_MODE === 'true';

// Initialize Supabase client
console.log('Initializing Supabase client with:');
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Key exists' : 'Key is missing');
console.log('MOCK_MODE:', MOCK_MODE ? 'Enabled' : 'Disabled');

// Use mock Supabase client in mock mode, otherwise use real client
export const supabase = MOCK_MODE
  ? mockSupabase // Use our mock implementation
  : createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );

/**
 * Check Supabase connection
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // If in mock mode, always return true
  if (MOCK_MODE) {
    console.log('Mock mode enabled, skipping Supabase connection check');
    return true;
  }
  
  try {
    console.log('Checking Supabase connection...');
    
    // First try a simple auth check which doesn't require any specific RPC function
    console.log('Trying basic auth check...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Basic auth check failed:', authError.message);
    } else {
      console.log('Basic auth check successful');
      return true;
    }
    
    // If auth check fails, try the RPC function
    console.log('Trying RPC function check...');
    try {
      const { data, error } = await supabase.rpc('check_connection');
      
      if (error) {
        console.error('RPC check error:', error.message);
        console.error('Error details:', error);
      } else {
        console.log('RPC check successful:', data);
        return true;
      }
    } catch (rpcError) {
      console.error('RPC check exception:', rpcError);
    }
    
    // If both previous checks fail, try a simple table query as last resort
    console.log('Trying table query check...');
    try {
      // Try to query any table that should exist in the database
      // This is a generic approach that should work with most Supabase setups
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (profileError) {
        console.error('Profile query failed:', profileError.message);
        
        // Try users table as last resort
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .limit(1);
          
        if (userError) {
          console.error('Users query failed:', userError.message);
          return false;
        }
        
        console.log('Users query successful');
        return true;
      }
      
      console.log('Profile query successful');
      return true;
    } catch (queryError) {
      console.error('Query check exception:', queryError);
      return false;
    }
  } catch (error) {
    console.error('Exception in connection check:', error);
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
    // First check if the audit_logs table exists
    const { data: tableExists, error: tableError } = await supabase.rpc('check_table_exists', {
      table_name: 'audit_logs'
    });
    
    if (tableError || !tableExists) {
      console.error('audit_logs table does not exist:', tableError);
      return;
    }
    
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        ip_address: '0.0.0.0', // Replace with actual client IP address
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
    // First check if the table exists
    const { data: tableExists, error: tableError } = await supabase.rpc('check_table_exists', {
      table_name: 'extended_audit_logs'
    });
    
    if (tableError || !tableExists) {
      console.error('extended_audit_logs table does not exist:', tableError);
      return;
    }
    
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
        ip_address: '0.0.0.0', // Replace with actual client IP address
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
    // Use the safely created function to check if the partitioned table exists
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: 'audit_logs_partitioned'
    });
    
    if (error || !data) {
      console.log('audit_logs_partitioned table does not exist:', error);
      return false;
    }
    
    // Additional partition management code would go here
    return true;
  } catch (error) {
    console.error('Error managing audit log partitions:', error);
    return false;
  }
};


import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import CryptoJS from 'crypto-js';

// Use environment variables from your Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wpmjvgvmjqffxpxtrlnb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbWp2Z3ZtanFmZnhweHRybG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDY2MDMsImV4cCI6MjA1NzM4MjYwM30.ADGE65CFoI9a4nVWn55RvPMfC5PfQfBLZmfwQSdRkmY';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to check Supabase connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Perform a simple query to check connectivity
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true }).limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};

// Encryption utility function
export const encryptData = (data: string): string => {
  // Use a secure encryption key - in production, use environment variables
  const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secure-key-change-in-production';
  
  // Encrypt the data using AES
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
};

// Decryption utility function
export const decryptData = (encryptedData: string): string => {
  const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secure-key-change-in-production';
  
  // Decrypt the data
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Legacy audit logging function - maintained for backward compatibility
export const logAuditEvent = async (
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details: Record<string, any> = {}
) => {
  try {
    if (!userId || !action || !resourceType || !resourceId) {
      console.warn('Audit log missing required fields');
      return;
    }
    
    const clientInfo = {
      ip: 'client_ip_unknown',
      userAgent: navigator?.userAgent || 'unknown'
    };
    
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: JSON.stringify(details),
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent
      });
  } catch (err) {
    console.error('Failed to log audit event:', err);
    // Don't block the main flow if audit logging fails
  }
};

// Enhanced audit logging interface for better HIPAA compliance
export interface EnhancedAuditLogParams {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  patientId?: string;
  accessReason?: string;
  accessType: 'standard_access' | 'emergency_access' | 'minimum_necessary' | 'authorized_disclosure';
  isEmergencyAccess?: boolean;
  emergencyReason?: string;
  authorizationSource?: string;
  details?: Record<string, any>;
}

// Enhanced audit logging function for HIPAA compliance
export const logEnhancedAuditEvent = async (params: EnhancedAuditLogParams) => {
  try {
    // Validate required fields
    if (!params.userId || !params.action || !params.resourceType || !params.resourceId) {
      console.warn('Enhanced audit log missing required fields');
      return;
    }
    
    const clientInfo = {
      ip: 'client_ip_unknown',
      userAgent: navigator?.userAgent || 'unknown'
    };
    
    // Insert into the new extended_audit_logs table
    await supabase
      .from('extended_audit_logs')
      .insert({
        user_id: params.userId,
        action: params.action,
        resource_type: params.resourceType,
        resource_id: params.resourceId,
        patient_id: params.patientId,
        access_reason: params.accessReason,
        access_type: params.accessType,
        is_emergency_access: params.isEmergencyAccess || false,
        emergency_reason: params.emergencyReason,
        authorization_source: params.authorizationSource,
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent,
        details: params.details
      });
      
    // Also log to legacy audit_logs for backward compatibility
    await logAuditEvent(
      params.userId,
      params.action,
      params.resourceType,
      params.resourceId,
      {
        ...params.details,
        accessReason: params.accessReason,
        accessType: params.accessType,
        patientId: params.patientId
      }
    );
  } catch (err) {
    console.error('Failed to log enhanced audit event:', err);
    // Don't block the main flow if audit logging fails
  }
};

// Function to check if a user has a specific permission - using the new granular permissions system
export const checkUserPermission = async (
  userId: string,
  permissionCode: string
): Promise<boolean> => {
  try {
    // Use the database function to check permissions
    const { data, error } = await supabase.rpc('user_has_permission', {
      p_user_id: userId,
      p_permission_code: permissionCode
    });
    
    if (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in checkUserPermission:', error);
    return false;
  }
};

// Function to check database performance and get statistics
export const getQueryPerformanceStats = async (
  minExecutionTime = 100, // minimum execution time in milliseconds to filter by
  limit = 50 // limit number of slow queries to return
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('query_performance_logs')
      .select('*')
      .gte('execution_time', minExecutionTime)
      .order('execution_time', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching query performance stats:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getQueryPerformanceStats:', error);
    return [];
  }
};

// Function to refresh materialized views (for admin/maintenance operations)
export const refreshMaterializedView = async (viewName: string): Promise<boolean> => {
  try {
    // Use a function that doesn't exist in the RLS policy system to refresh the view
    // In a real implementation, this would call a stored procedure with security definer
    const { error } = await supabase.rpc('refresh_materialized_view', {
      view_name: viewName
    });
    
    if (error) {
      console.error(`Error refreshing materialized view ${viewName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in refreshMaterializedView for ${viewName}:`, error);
    return false;
  }
};

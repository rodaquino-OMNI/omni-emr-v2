
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Use environment variables or fall back to development values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Audit logging function
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

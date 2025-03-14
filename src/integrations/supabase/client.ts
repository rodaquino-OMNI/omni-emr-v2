
import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';
import { Database } from './types';

// Environment variables would be better in production
const supabaseUrl = 'https://wpmjvgvmjqffxpxtrlnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbWp2Z3ZtanFmZnhweHRybG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDY2MDMsImV4cCI6MjA1NzM4MjYwM30.ADGE65CFoI9a4nVWn55RvPMfC5PfQfBLZmfwQSdRkmY';

// Create Supabase client with proper config and typings
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// For production, this key should be stored in environment variables or secure storage
// Consider using a key derivation function in production
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'OMNICare-HIPAA-Compliant-Key';

export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    // Return a flag indicating encryption failure
    return `ENCRYPTION_FAILED:${data}`;
  }
};

export const decryptData = (ciphertext: string): string => {
  try {
    // Check if encryption previously failed
    if (ciphertext.startsWith('ENCRYPTION_FAILED:')) {
      return ciphertext.replace('ENCRYPTION_FAILED:', '');
    }
    
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return ''; // Return empty string on failure
  }
};

// Enhanced audit logging with better error handling
export const logAuditEvent = async (
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: any
): Promise<boolean> => {
  try {
    const userAgent = navigator.userAgent;
    
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      user_agent: userAgent,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Only show toast in development or to admin users
    if (process.env.NODE_ENV === 'development') {
      toast.error('Failed to log security audit event', {
        description: 'This might affect compliance reporting',
      });
    }
    return false;
  }
};

// Check if Supabase connection is healthy
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple test query to check connection
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

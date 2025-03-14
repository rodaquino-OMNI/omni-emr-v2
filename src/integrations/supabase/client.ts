
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import CryptoJS from 'crypto-js';

// Use environment variables or fall back to development values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to check Supabase connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Perform a simple query to check connectivity
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
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

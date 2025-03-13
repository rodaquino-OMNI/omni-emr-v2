
import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

const supabaseUrl = 'https://wpmjvgvmjqffxpxtrlnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbWp2Z3ZtanFmZnhweHRybG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDY2MDMsImV4cCI6MjA1NzM4MjYwM30.ADGE65CFoI9a4nVWn55RvPMfC5PfQfBLZmfwQSdRkmY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Encryption utilities for HIPAA compliance (data encryption at rest)
const SECRET_KEY = 'OMNICare-HIPAA-Compliant-Key'; // In production, use environment variables

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Function to log audit entries for security tracking
export const logAuditEvent = async (
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: any
) => {
  try {
    const userAgent = navigator.userAgent;
    
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      user_agent: userAgent,
      // IP address would typically be captured on the server side
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

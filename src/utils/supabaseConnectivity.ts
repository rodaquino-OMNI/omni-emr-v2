
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the Supabase connection is working
 * @returns Promise<boolean> true if connected, false otherwise
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Use the dedicated check_connection RPC function
    const { data, error } = await supabase.rpc('check_connection');
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};

/**
 * Alias for checkSupabaseConnection for backward compatibility
 */
export const checkConnectivity = checkSupabaseConnection;

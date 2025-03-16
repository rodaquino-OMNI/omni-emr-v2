
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the Supabase connection is working
 * @returns Promise<boolean> true if connected, false otherwise
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple query to check if we can connect to Supabase
    const { error } = await supabase.from('auth').select('*', { count: 'exact', head: true }).limit(1);
    
    // If there's an error that's not a "relation does not exist" error, consider it a connection issue
    if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
      console.error('Supabase connection test error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};

/**
 * Alias for checkSupabaseConnection for backward compatibility
 */
export const checkConnectivity = checkSupabaseConnection;


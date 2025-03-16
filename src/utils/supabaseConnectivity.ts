
import { supabase } from '@/integrations/supabase/core';

/**
 * Safely checks if the application can connect to Supabase using the check_connection function
 * @returns A boolean indicating if Supabase is connected
 */
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    // Use the check_connection function which doesn't depend on specific tables
    const { data, error } = await supabase.rpc('check_connection');
    
    if (error) {
      console.error('Failed to connect to Supabase:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception when connecting to Supabase:', error);
    return false;
  }
};

/**
 * Safely checks and displays a warning if the database connection is not working
 */
export const showConnectionWarning = async (): Promise<void> => {
  try {
    const isConnected = await checkConnectivity();
    
    if (!isConnected) {
      // Use a more user-friendly approach for showing warnings
      // This could be integrated with your toast/notification system
      console.warn('Database connection failed - functionality may be limited');
    }
  } catch (error) {
    console.error('Error checking database connection:', error);
  }
};

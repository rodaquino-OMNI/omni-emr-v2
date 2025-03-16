
import { supabase } from '@/integrations/supabase/core';

/**
 * Checks if the application can connect to Supabase
 * @returns A boolean indicating if Supabase is connected
 */
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    // Use the newly created check_connection function instead of directly querying a table
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
 * Checks and displays a warning if the database connection is not working
 */
export const showConnectionWarning = async (): Promise<void> => {
  const isConnected = await checkConnectivity();
  
  if (!isConnected) {
    // Use a more user-friendly approach for showing warnings
    // This could be integrated with your toast/notification system
    console.warn('Database connection failed - functionality may be limited');
  }
};

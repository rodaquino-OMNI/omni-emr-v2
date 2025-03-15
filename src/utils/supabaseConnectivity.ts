
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if Supabase is accessible by making a simple query
 * @returns Promise<boolean> True if connectivity is working
 */
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    // First check if network is available at all
    if (!navigator.onLine) {
      console.log('Browser reports network is offline');
      return false;
    }
    
    // Simple query to check connectivity - just check if profiles table exists
    const { count } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
      .limit(1)
      .throwOnError();
      
    // Also check if appointments table exists to verify database structure
    const { count: appointmentsCount } = await supabase
      .from('appointments')
      .select('count', { count: 'exact', head: true })
      .limit(1)
      .throwOnError();

    // If we get here, the connection is working
    return true;
  } catch (error) {
    console.error('Supabase connectivity check failed:', error);
    return false;
  }
};

/**
 * Periodically check connectivity and call the callback when status changes
 * @param callback Function to call when connectivity status changes
 * @param interval Time in ms between checks (default: 30000ms = 30s)
 * @returns Cleanup function
 */
export const monitorConnectivity = (
  callback: (isConnected: boolean) => void,
  interval = 30000
): () => void => {
  let lastStatus: boolean | null = null;
  
  const checkStatus = async () => {
    try {
      const isConnected = await checkConnectivity();
      
      // Only call the callback if status has changed
      if (lastStatus === null || lastStatus !== isConnected) {
        lastStatus = isConnected;
        callback(isConnected);
      }
    } catch (error) {
      console.error('Error in connectivity monitor:', error);
      // If error checking, assume disconnected
      if (lastStatus !== false) {
        lastStatus = false;
        callback(false);
      }
    }
  };
  
  // Check immediately
  checkStatus();
  
  // Set up interval
  const intervalId = setInterval(checkStatus, interval);
  
  // Also check when browser online/offline status changes
  const handleOnline = () => {
    console.log('Browser reports online');
    checkStatus();
  };
  
  const handleOffline = () => {
    console.log('Browser reports offline');
    if (lastStatus !== false) {
      lastStatus = false;
      callback(false);
    }
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};


import { supabase } from '@/integrations/supabase/core';

/**
 * Checks if we can connect to Supabase
 * @returns Promise<boolean> True if connected, false otherwise
 */
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    // Simple ping to the Supabase API
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    // If no error, we're connected
    return !error;
  } catch (error) {
    console.error('Connectivity check failed:', error);
    return false;
  }
};

/**
 * Checks if we're online (general internet connectivity)
 * @returns boolean True if online, false if offline
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Registers event listeners for online/offline status
 * @param onOffline Callback for offline event
 * @param onOnline Callback for online event
 * @returns Function to unregister listeners
 */
export const registerConnectivityListeners = (
  onOffline: () => void,
  onOnline: () => void
): () => void => {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
};

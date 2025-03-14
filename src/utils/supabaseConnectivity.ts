
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { verifyRequiredTables } from './supabaseTableCheck';

// Global connection state
let isConnected = false;
let lastCheckTime = 0;
const CHECK_INTERVAL = 60000; // 1 minute

// Check Supabase connectivity
export const checkConnectivity = async (showToasts = false): Promise<boolean> => {
  const now = Date.now();
  
  // Don't check too frequently
  if (now - lastCheckTime < CHECK_INTERVAL && lastCheckTime > 0) {
    return isConnected;
  }
  
  lastCheckTime = now;
  
  try {
    // Try to connect to Supabase
    isConnected = await checkSupabaseConnection();
    
    if (showToasts) {
      if (isConnected) {
        toast.success('Connected to Supabase successfully', {
          description: 'Your application is properly connected to the backend.',
          duration: 3000,
        });
        
        // If connected, also verify tables exist
        await verifyRequiredTables();
      } else {
        toast.error('Cannot connect to Supabase', {
          description: 'Check your internet connection or Supabase configuration.',
          duration: 5000,
        });
      }
    }
    
    return isConnected;
  } catch (error) {
    console.error('Error checking Supabase connectivity:', error);
    
    if (showToasts) {
      toast.error('Error checking Supabase connection', {
        description: 'Failed to verify backend connectivity.',
        duration: 5000,
      });
    }
    
    isConnected = false;
    return false;
  }
};

// Monitor Supabase authentication changes
export const setupConnectivityMonitor = () => {
  // Check initial connection
  checkConnectivity();
  
  // Set up interval to check connectivity
  const intervalId = setInterval(() => {
    checkConnectivity();
  }, CHECK_INTERVAL);
  
  // Set up auth state change listener to verify connectivity
  const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
    checkConnectivity();
  });
  
  // Cleanup function
  return () => {
    clearInterval(intervalId);
    subscription.unsubscribe();
  };
};

// Create a hook for components to use connectivity state
export const createSupabaseStatusListener = (onConnected?: () => void, onDisconnected?: () => void) => {
  const checkStatus = async () => {
    const connected = await checkConnectivity();
    
    if (connected && onConnected) {
      onConnected();
    } else if (!connected && onDisconnected) {
      onDisconnected();
    }
  };
  
  // Check immediately
  checkStatus();
  
  // Set up interval to check
  const intervalId = setInterval(checkStatus, CHECK_INTERVAL);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};

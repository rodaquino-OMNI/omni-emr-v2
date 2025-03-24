import { supabase } from '@/integrations/supabase/client';
import { isMockMode } from '@/services/mockService';

// Check if we're in mock mode
const MOCK_MODE = isMockMode || import.meta.env.VITE_MOCK_MODE === 'true';

/**
 * Checks if Supabase is accessible and working
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // If in mock mode, always return true
  if (MOCK_MODE) {
    console.log('Mock mode enabled, skipping Supabase connection check');
    return true;
  }
  
  try {
    // Try to fetch a small amount of data to check connectivity
    const { data, error } = await supabase
      .from('health_check')
      .select('status')
      .limit(1);
    
    if (error) {
      console.error('Supabase connectivity error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking Supabase connectivity:', error);
    return false;
  }
};

// Alias for backward compatibility
export const checkConnectivity = checkSupabaseConnection;


import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if Supabase is accessible and working
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try to fetch a small amount of data to check connectivity
    const { data, error } = await supabase
      .from('health_check')
      .select('status')
      .limit(1)
      .maybeSingle();
    
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

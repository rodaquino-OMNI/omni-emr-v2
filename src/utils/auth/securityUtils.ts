
import { supabase } from '@/integrations/supabase/client';

// Check if user has MFA enabled
export const hasEnabledMFA = async (userId: string): Promise<boolean> => {
  try {
    // Since mfa_enabled doesn't exist yet in the profiles table
    // We'll just return false for now until we add that column
    return false;
    
    /* Commented out until we add the mfa_enabled column
    const { data, error } = await supabase
      .from('profiles')
      .select('mfa_enabled')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return !!data?.mfa_enabled;
    */
  } catch (error) {
    console.error('Error checking MFA status:', error);
    return false;
  }
};

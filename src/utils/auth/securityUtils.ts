
import { supabase } from '@/integrations/supabase/core';

// Check if a user has MFA enabled
export const hasEnabledMFA = async (userId: string): Promise<boolean> => {
  try {
    // Query the profiles table to check if MFA is enabled
    const { data, error } = await supabase
      .from('profiles')
      .select('mfaEnabled')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.mfaEnabled || false;
  } catch (error) {
    console.error('Error checking MFA status:', error);
    return false;
  }
};

// Other security utility functions can be added here

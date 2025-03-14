
import { supabase } from '@/integrations/supabase/client';

// Check if user has MFA enabled
export const hasEnabledMFA = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('mfa_enabled')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return !!data?.mfa_enabled;
  } catch (error) {
    console.error('Error checking MFA status:', error);
    return false;
  }
};

// Check if a password is potentially leaked
export const checkPasswordLeak = async (password: string): Promise<boolean> => {
  try {
    // This is a placeholder for integration with haveibeenpwned API
    // In production, you would use their k-anonymity model API
    // This would typically be implemented in a serverless function
    return false;
  } catch (error) {
    console.error('Error checking password leak status:', error);
    return false;
  }
};

// Get user's MFA factors
export const getUserMFAFactors = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();
    
    if (error) throw error;
    return data.all || [];
  } catch (error) {
    console.error('Error getting MFA factors:', error);
    return [];
  }
};

// Start the MFA setup process
export const startMFASetup = async (): Promise<any> => {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error starting MFA setup:', error);
    throw error;
  }
};

// Verify and complete MFA setup
export const verifyMFASetup = async (factorId: string, code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({ 
      factorId, 
      code 
    });
    
    if (error) throw error;
    
    // Update the user's profile to mark MFA as enabled
    await supabase
      .from('profiles')
      .update({ mfa_enabled: true })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);
    
    return true;
  } catch (error) {
    console.error('Error verifying MFA setup:', error);
    return false;
  }
};

// Unenroll from MFA
export const unenrollMFA = async (factorId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.mfa.unenroll({ 
      factorId 
    });
    
    if (error) throw error;
    
    // Update the user's profile to mark MFA as disabled
    await supabase
      .from('profiles')
      .update({ mfa_enabled: false })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);
    
    return true;
  } catch (error) {
    console.error('Error unenrolling from MFA:', error);
    return false;
  }
};

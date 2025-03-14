
import { supabase } from '@/integrations/supabase/client';
import * as CryptoJS from 'crypto-js';

// Check if user has MFA enabled
export const hasEnabledMFA = async (userId: string): Promise<boolean> => {
  try {
    // First check if the column exists
    const { data: columns, error: columnsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    // If we don't have the mfa_enabled column yet, return false
    if (columnsError || !columns || !columns.length || !('mfa_enabled' in columns[0])) {
      console.warn('MFA column not found in profiles table');
      return false;
    }
      
    // Now try to get the actual value
    const { data, error } = await supabase
      .from('profiles')
      .select('mfa_enabled')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data && 'mfa_enabled' in data ? !!data.mfa_enabled : false;
  } catch (error) {
    console.error('Error checking MFA status:', error);
    return false;
  }
};

// Check if a password is potentially leaked
export const checkPasswordLeak = async (password: string): Promise<boolean> => {
  try {
    // Generate a SHA-1 hash of the password
    const sha1Hash = CryptoJS.SHA1(password).toString().toUpperCase();
    
    // Use the k-anonymity model that HaveIBeenPwned API supports
    // We only send the first 5 chars of the hash (prefix) to maintain privacy
    const prefix = sha1Hash.substring(0, 5);
    const suffix = sha1Hash.substring(5);
    
    // Query the API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'MedCare-HealthApp/1.0',
        'Accept': 'text/plain'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check password against database');
    }
    
    // The response contains suffixes with breach counts
    const text = await response.text();
    const breachedHashes = text.split('\n');
    
    // Check if our suffix exists in the response
    for (const hashLine of breachedHashes) {
      const [hashSuffix] = hashLine.split(':');
      if (hashSuffix.trim() === suffix) {
        return true; // Password has been found in a breach
      }
    }
    
    return false; // Password not found in any known breaches
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
    
    // Check if the column exists before updating
    const { data: columns, error: columnsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (columnsError || !columns || !columns.length || !('mfa_enabled' in columns[0])) {
      console.warn('MFA column not found in profiles table, skipping profile update');
      return true;
    }
    
    // Update the user's profile to mark MFA as enabled
    const updateData: Record<string, any> = { mfa_enabled: true };
    
    await supabase
      .from('profiles')
      .update(updateData)
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
    
    // Check if the column exists before updating
    const { data: columns, error: columnsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (columnsError || !columns || !columns.length || !('mfa_enabled' in columns[0])) {
      console.warn('MFA column not found in profiles table, skipping profile update');
      return true;
    }
    
    // Update the user's profile to mark MFA as disabled
    const updateData: Record<string, any> = { mfa_enabled: false };
    
    await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', (await supabase.auth.getUser()).data.user?.id);
    
    return true;
  } catch (error) {
    console.error('Error unenrolling from MFA:', error);
    return false;
  }
};

// Challenge MFA during login
export const challengeMFA = async (factorId: string): Promise<{
  challengeId?: string;
  error?: Error;
}> => {
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId
    });
    
    if (error) throw error;
    return { challengeId: data.id };
  } catch (error) {
    console.error('Error challenging MFA:', error);
    return { error: error as Error };
  }
};

// Verify MFA challenge
export const verifyMFAChallenge = async (
  factorId: string, 
  challengeId: string, 
  code: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code
    });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error verifying MFA challenge:', error);
    return false;
  }
};

// Check password strength
export const checkPasswordStrength = (password: string): { 
  score: number; 
  feedback: string;
} => {
  let score = 0;
  let feedback = '';
  
  // Length check (0-4 points)
  if (password.length < 8) {
    score += 0;
    feedback = 'Password is too short';
  } else if (password.length >= 12) {
    score += 4;
  } else {
    score += 2;
  }
  
  // Complexity checks (add points for each)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  
  if (hasLowercase) score += 1;
  if (hasUppercase) score += 1;
  if (hasDigits) score += 1;
  if (hasSpecialChars) score += 1;
  
  // Generate feedback
  if (score <= 4) {
    feedback = 'Weak password. Use a longer password with mixed case, numbers, and symbols.';
  } else if (score <= 6) {
    feedback = 'Moderate password. Consider adding more variety.';
  } else {
    feedback = 'Strong password!';
  }
  
  return { score, feedback };
};

// Check if MFA is required for a user
export const isMFARequired = async (userId: string): Promise<boolean> => {
  try {
    // Check if the settings migration table exists and has MFA requirement
    const { data, error } = await supabase
      .from('auth_settings_migrations')
      .select('enabled')
      .eq('setting_name', 'mfa_totp')
      .single();
    
    if (error) {
      console.warn('Could not determine if MFA is required from settings:', error.message);
      return false;
    }
    
    // If MFA is globally required, check for user role exceptions
    // For example, we might want to force MFA for admin users
    if (data?.enabled) {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.warn('Could not determine user role for MFA requirement check:', profileError.message);
        return false;
      }
      
      // Force MFA for admin, doctor, and nurse roles
      if (userProfile?.role && ['admin', 'doctor', 'nurse', 'system_administrator'].includes(userProfile.role)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if MFA is required:', error);
    return false;
  }
};

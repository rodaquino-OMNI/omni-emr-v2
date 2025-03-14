import { Session, Provider } from '@supabase/supabase-js';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { User, UserRole } from '../types/auth';
import { mockUsers } from './mockUsers';
import { mapSupabaseUserToUser } from './userMappingUtils';

export const signInWithProvider = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline', // Request a refresh token for long-lived sessions
        prompt: 'consent' // Force consent screen to ensure we get refresh token
      },
    },
  });
  
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  // Check if this is a mock user - for demo purposes
  const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (mockUser) {
    // Log audit event for mock user login
    logAuditEvent(
      mockUser.id,
      'login',
      'user',
      mockUser.id,
      { method: 'email_password', mock: true }
    );
    
    // Return mock user data for demo purposes
    return {
      user: mockUser,
      session: { 
        user: { 
          id: mockUser.id, 
          email: mockUser.email,
          user_metadata: {
            name: mockUser.name,
            role: mockUser.role
          }
        }
      } as unknown as Session
    };
  }
  
  // For non-mock users, use Supabase authentication with enhanced options
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken: window.localStorage.getItem('captcha_token') || undefined,
    }
  });
  
  if (error) throw error;
  
  // Log audit event for real user login
  if (data.user) {
    logAuditEvent(
      data.user.id,
      'login',
      'user',
      data.user.id,
      { method: 'email_password' }
    );
    
    // Store the session expiry time for session management
    if (data.session?.expires_at) {
      const expiryTime = new Date(data.session.expires_at * 1000).toISOString();
      localStorage.setItem('session_expiry', expiryTime);
    }
  }
  
  return data;
};

export const signInWithPhone = async (phone: string, password?: string) => {
  try {
    // First check if this is a phone verification flow or a login flow
    if (!password) {
      // This is a phone verification flow
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true, // Create the user if they don't exist
        }
      });
      
      if (error) throw error;
      
      // Log audit event for phone verification request
      logAuditEvent(
        'system',  // No user ID available yet
        'otp_requested',
        'auth',
        phone,
        { method: 'phone' }
      );
      
      // Return an object with a consistent format that includes success flag
      return { data, success: true, user: null, session: null };
    } else {
      // This is a login flow with phone + password
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });
      
      if (error) throw error;
      
      // Log audit event for real user login
      if (data.user) {
        logAuditEvent(
          data.user.id,
          'login',
          'user',
          data.user.id,
          { method: 'phone_password' }
        );
        
        // Store the session expiry time for session management
        if (data.session?.expires_at) {
          const expiryTime = new Date(data.session.expires_at * 1000).toISOString();
          localStorage.setItem('session_expiry', expiryTime);
        }
      }
      
      return { ...data, success: true };
    }
  } catch (error) {
    console.error('Phone sign-in error:', error);
    throw error;
  }
};

export const verifyPhoneOTP = async (phone: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });
    
    if (error) throw error;
    
    // Log audit event for OTP verification
    if (data.user) {
      logAuditEvent(
        data.user.id,
        'login',
        'user',
        data.user.id,
        { method: 'phone_otp' }
      );
      
      // Store the session expiry time for session management
      if (data.session?.expires_at) {
        const expiryTime = new Date(data.session.expires_at * 1000).toISOString();
        localStorage.setItem('session_expiry', expiryTime);
      }
    }
    
    // Return with a consistent format including success flag
    return { ...data, success: true };
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

export const signOut = async () => {
  // Get the current user before signing out
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  
  const { error } = await supabase.auth.signOut({
    scope: 'global' // Sign out from all tabs/devices, not just current
  });
  
  if (error) throw error;
  
  // Clear any session data
  localStorage.removeItem('session_expiry');
  
  // Log audit event for logout
  if (userId) {
    logAuditEvent(
      userId,
      'logout',
      'user',
      userId,
      {}
    );
  }
};

// Enhanced function to refresh the session token
export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error || !data.session) {
      console.error('Failed to refresh session:', error);
      return false;
    }
    
    // Update the session expiry time
    if (data.session.expires_at) {
      const expiryTime = new Date(data.session.expires_at * 1000).toISOString();
      localStorage.setItem('session_expiry', expiryTime);
    }
    
    return true;
  } catch (error) {
    console.error('Exception refreshing session:', error);
    return false;
  }
};

// New function to check if user has MFA enabled
export const hasEnabledMFA = async (userId: string): Promise<boolean> => {
  try {
    // Since mfa_enabled doesn't exist yet in the profiles table
    // We'll just return false for now until we add that column
    // Later, we can implement this properly
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

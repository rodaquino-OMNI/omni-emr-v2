
import { supabase, logAuditEvent } from '@/integrations/supabase/client';

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

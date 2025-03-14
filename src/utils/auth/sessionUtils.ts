
import { supabase, logAuditEvent } from '@/integrations/supabase/client';

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

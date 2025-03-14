
import { useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { refreshSession } from '@/utils/authUtils';

export const useSessionRefresh = () => {
  // Helper function to set up session refresh
  const startSessionRefreshTimer = useCallback((session: Session | null) => {
    if (!session?.expires_at) return;
    
    // Calculate when to refresh (5 minutes before expiry)
    const expiryTime = new Date(session.expires_at * 1000);
    const refreshTime = new Date(expiryTime.getTime() - 5 * 60 * 1000);
    const now = new Date();
    
    // Set timeout to refresh session
    const timeoutMs = Math.max(0, refreshTime.getTime() - now.getTime());
    setTimeout(() => {
      refreshSession()
        .then(success => {
          if (!success) {
            console.warn('Session refresh failed, user may need to re-login');
          }
        })
        .catch(err => console.error('Error in session refresh:', err));
    }, timeoutMs);
  }, []);

  return {
    startSessionRefreshTimer
  };
};

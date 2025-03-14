
import { Provider } from '@supabase/supabase-js';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';

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

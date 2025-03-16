
import { supabase } from '@/integrations/supabase/client';

// Match the Provider type to what's used in the Supabase auth-js library
export type Provider = 'google' | 'facebook' | 'twitter' | 'azure' | 'apple' | 'github' | 'gitlab' | 'bitbucket' | 'discord' | 'notion' | 'slack' | 'spotify' | 'twitch' | 'workos' | 'zoom';

export interface AuthResult {
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Handle social provider authentication
 */
export const signInWithProvider = async (provider: Provider): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/sectors`
      }
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code
        }
      };
    }

    // For OAuth, success happens after redirect
    return { success: !!data };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'An error occurred during social login'
      }
    };
  }
};

// Add the loginWithSocial function as an alias to signInWithProvider for backward compatibility
export const loginWithSocial = signInWithProvider;


import { supabase } from '@/integrations/supabase/client';

export type Provider = 'google' | 'facebook' | 'twitter' | 'azure';

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
export const loginWithSocial = async (provider: Provider): Promise<AuthResult> => {
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


import { supabase } from '@/integrations/supabase/core';
import { UserRole } from '@/types/auth';

export const signUpWithEmail = async (email: string, password: string, name: string, role: UserRole) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback?registration=true`,
    },
  });

  if (error) throw error;

  return data;
};

export const requestPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password/update`,
  });

  if (error) throw error;

  return { success: true };
};

// Add the missing updatePassword function
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};


import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { UserRole } from '../types/auth';
import { mockUsers } from './mockUsers';
import { mapSupabaseUserToUser } from './userMappingUtils';

export const signUpWithEmail = async (email: string, password: string, name: string, role: UserRole) => {
  console.log('Starting signUpWithEmail:', { email, name, role });
  
  // For demo purposes, check if it's one of our mock users first
  const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (mockUser) {
    console.log('Mock user found, returning success');
    return { user: mockUser, session: null, success: true };
  }
  
  // Clinical roles that require admin approval
  const clinicalRoles: UserRole[] = ['doctor', 'nurse', 'specialist', 'pharmacist', 'lab_technician', 'radiology_technician'];
  const requiresApproval = clinicalRoles.includes(role);
  
  // For real users, use Supabase authentication
  console.log('Calling supabase.auth.signUp with:', { email, password, name, role });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        requires_approval: requiresApproval
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  console.log('Supabase signUp response:', { data, error });
  
  if (error) {
    console.error('Supabase signup error:', error);
    throw error;
  }
  
  // Log audit event for user registration
  if (data.user) {
    try {
      await logAuditEvent(
        data.user.id,
        'register',
        'user',
        data.user.id,
        { role, requires_approval: requiresApproval }
      );
    } catch (auditError) {
      console.error('Error logging audit event:', auditError);
      // Continue with registration even if audit logging fails
    }
    
    try {
      // Add the user to the profiles table manually as a fallback
      const profileData = {
        id: data.user.id,
        email: email,
        name: name,
        role: role,
        // Set approval status based on role
        approval_status: requiresApproval ? 'pending' : 'approved'
      };
      
      console.log('Manually inserting profile:', profileData);
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    } catch (profileError) {
      console.error('Error in profile creation:', profileError);
    }
  }
  
  // Attempt to map the user to our application's User type if possible
  let mappedUser = null;
  if (data.user) {
    try {
      mappedUser = await mapSupabaseUserToUser(data.user);
    } catch (mappingError) {
      console.error('Error mapping user:', mappingError);
      // Continue with registration even if mapping fails
    }
  }
  
  return { 
    user: mappedUser, 
    session: data.session,
    success: true
  };
};

// Function to handle password reset request
export const requestPasswordReset = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Function to update password after reset
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

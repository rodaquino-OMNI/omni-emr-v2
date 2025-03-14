
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { getUserPermissions } from './permissionUtils';

/**
 * Maps a Supabase user to our application's User interface
 */
export const mapSupabaseUserToUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Get user profile from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', supabaseUser.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // Fallback to defaults if profile fetch fails
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || 'User',
        role: (supabaseUser.user_metadata?.role as UserRole) || 'patient',
        permissions: []
      };
    }

    // Validate the role is one of our allowed roles
    const validRoles: UserRole[] = [
      'admin', 'doctor', 'nurse', 'caregiver', 'patient', 'specialist', 
      'administrative', 'pharmacist', 'lab_technician', 'radiology_technician', 
      'system_administrator'
    ];
    
    const role = profileData.role as UserRole;
    const validRole = validRoles.includes(role) ? role : 'patient';

    // Get permissions for this user
    const permissions = await getUserPermissions({
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profileData.name || supabaseUser.user_metadata?.name || 'User',
      role: validRole,
      permissions: []
    });

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profileData.name || supabaseUser.user_metadata?.name || 'User',
      role: validRole,
      permissions
    };
  } catch (error) {
    console.error('Error mapping Supabase user:', error);
    // Provide fallback user mapping in case of errors
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'User',
      role: (supabaseUser.user_metadata?.role as UserRole) || 'patient',
      permissions: []
    };
  }
};

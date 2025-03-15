
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole, ApprovalStatus } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { getUserPermissions } from './permissions/roleChecks';

/**
 * Maps a Supabase user to our application's User interface
 */
export const mapSupabaseUserToUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Get user profile from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, role, approval_status')
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
        permissions: [],
        approvalStatus: 'approved' // Default to approved for backward compatibility
      };
    }

    // Check if user account is approved
    const approvalStatus = (profileData.approval_status as ApprovalStatus) || 'approved';
    
    // Clinical roles that need approval
    const clinicalRoles: UserRole[] = ['doctor', 'nurse', 'specialist', 'pharmacist', 'lab_technician', 'radiology_technician'];
    const requiresApproval = clinicalRoles.includes(profileData.role as UserRole);
    
    // Validate the role is one of our allowed roles
    const validRoles: UserRole[] = [
      'admin', 'doctor', 'nurse', 'caregiver', 'patient', 'specialist', 
      'administrative', 'pharmacist', 'lab_technician', 'radiology_technician', 
      'system_administrator'
    ];
    
    const role = profileData.role as UserRole;
    const validRole = validRoles.includes(role) ? role : 'patient';

    // Create the base user object without permissions first
    const baseUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profileData.name || supabaseUser.user_metadata?.name || 'User',
      role: validRole,
      approvalStatus: approvalStatus,
      permissions: []
    };

    // Only get permissions if account is approved or doesn't require approval
    let permissions: string[] = [];
    if (approvalStatus === 'approved' || !requiresApproval) {
      // Get permissions for this user
      permissions = await getUserPermissions(baseUser);
    }

    // Return the complete user object with permissions
    return {
      ...baseUser,
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
      permissions: [],
      approvalStatus: 'approved' // Default for backward compatibility
    };
  }
};

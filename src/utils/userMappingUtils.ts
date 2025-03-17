
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '@/utils/errorHandling';

export const mapSupabaseUserToUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // First try to get additional user data from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
      
    if (error) {
      console.warn('Error fetching user profile:', error);
      // Continue without profile data
    }
    
    // Extract role and other metadata from user_metadata or profile
    const metadata = supabaseUser.user_metadata || {};
    const userRole = (profile?.role || metadata.role || 'patient') as UserRole;
    
    // Construct the complete user object
    const user: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.name || metadata.name || 'User',
      role: userRole,
      status: profile?.status || 'active',
      permissions: profile?.permissions || [],
      mfaEnabled: profile?.mfa_enabled || false,
      createdAt: new Date(supabaseUser.created_at),
      organization: profile?.organization || metadata.organization,
      lastLogin: new Date(supabaseUser.last_sign_in_at || Date.now()),
      profileImageUrl: profile?.avatar_url || metadata.avatar_url,
      phoneNumber: profile?.phone || metadata.phone,
      approvalStatus: profile?.approval_status || 'approved',
      avatar: profile?.avatar_url || metadata.avatar_url,
      country: null,
      insurance: null
    };
    
    return user;
  } catch (error) {
    console.error('Error mapping Supabase user to app user:', error);
    // Provide a minimal user object when mapping fails
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || 'User',
      email: supabaseUser.email || '',
      role: (supabaseUser.user_metadata?.role || 'patient') as UserRole,
      status: 'active',
      permissions: [], // Add required permissions field
      country: null,
      insurance: null
    };
  }
};

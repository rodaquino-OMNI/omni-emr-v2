
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '../types/auth';
import { mockUsers } from './mockUsers';
import { rolePermissions } from './permissions';

export const mapSupabaseUserToUser = async (supabaseUser: any): Promise<User | null> => {
  if (!supabaseUser) return null;
  
  // Check if this is a mock user
  const mockUser = mockUsers.find(u => u.email === supabaseUser.email);
  if (mockUser) return mockUser;
  
  try {
    // Get user profile from profiles table
    const profileResponse = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();
      
    const profile = profileResponse?.data || null;
    const error = profileResponse?.error || null;
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    // If profile exists, use it
    if (profile) {
      const role = (profile.role as UserRole) || 'patient';
      return {
        id: supabaseUser.id,
        email: profile.email || supabaseUser.email || '',
        name: profile.name || 'User',
        role: role,
        permissions: rolePermissions[role] || []
      };
    }
    
    // Fallback to metadata if profile doesn't exist
    const metadata = supabaseUser.user_metadata || {};
    const role = (metadata.role as UserRole) || 'patient';
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: metadata.name || 'User',
      role: role,
      permissions: rolePermissions[role] || []
    };
  } catch (error) {
    console.error('Error mapping Supabase user:', error);
    
    // Fallback to basic mapping
    const metadata = supabaseUser.user_metadata || {};
    const role = (metadata.role as UserRole) || 'patient';
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: metadata.name || 'User',
      role: role,
      permissions: rolePermissions[role] || []
    };
  }
};

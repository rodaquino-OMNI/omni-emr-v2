
import { Session, Provider } from '@supabase/supabase-js';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { User, UserRole } from '../context/AuthContext';
import { mockUsers } from './mockUsers';

// Role-based permissions map
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all'],
  doctor: [
    'view_patients', 'edit_patients', 'prescribe_medications',
    'view_records', 'edit_records', 'schedule_appointments',
    'telemedicine', 'view_schedule'
  ],
  nurse: [
    'view_patients', 'edit_patients', 'view_medications',
    'view_records', 'schedule_appointments', 'view_schedule'
  ],
  caregiver: [
    'view_patients', 'view_medications', 'view_records'
  ],
  patient: [
    'view_own_records', 'view_own_medications', 'view_own_appointments'
  ]
};

// Function to check if a user has a specific permission
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // Admins have all permissions
  if (user.role === 'admin' || user.permissions.includes('all')) {
    return true;
  }
  
  return user.permissions.includes(permission);
};

// Function to check if a user can access a specific patient's data
export const canAccessPatientData = (user: User | null, patientId: string): boolean => {
  if (!user) return false;
  
  // Admins, doctors, and nurses can access all patient data
  if (user.role === 'admin' || user.role === 'doctor' || user.role === 'nurse') {
    return true;
  }
  
  // Patients can only access their own data
  if (user.role === 'patient') {
    return user.id === patientId;
  }
  
  // Caregivers would need a specific association with the patient
  // This would require a caregivers_patients table in a real application
  return false;
};

export const signInWithProvider = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  // Check if this is a mock user - for demo purposes
  const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (mockUser) {
    // Log audit event for mock user login
    logAuditEvent(
      mockUser.id,
      'login',
      'user',
      mockUser.id,
      { method: 'email_password', mock: true }
    );
    
    // Return mock user data for demo purposes
    return {
      user: mockUser,
      session: { 
        user: { 
          id: mockUser.id, 
          email: mockUser.email,
          user_metadata: {
            name: mockUser.name,
            role: mockUser.role
          }
        }
      } as unknown as Session
    };
  }
  
  // For non-mock users, use Supabase authentication
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Log audit event for real user login
  if (data.user) {
    logAuditEvent(
      data.user.id,
      'login',
      'user',
      data.user.id,
      { method: 'email_password' }
    );
  }
  
  return data;
};

export const signUpWithEmail = async (email: string, password: string, name: string, role: UserRole) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  });
  
  if (error) throw error;
  
  // Log audit event for user registration
  if (data.user) {
    logAuditEvent(
      data.user.id,
      'register',
      'user',
      data.user.id,
      { role }
    );
  }
  
  return data;
};

export const signOut = async () => {
  // Get the current user before signing out
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  // Log audit event for logout
  if (userId) {
    logAuditEvent(
      userId,
      'logout',
      'user',
      userId,
      {}
    );
  }
};

export const mapSupabaseUserToUser = async (supabaseUser: any): Promise<User | null> => {
  if (!supabaseUser) return null;
  
  // Check if this is a mock user
  const mockUser = mockUsers.find(u => u.email === supabaseUser.email);
  if (mockUser) return mockUser;
  
  try {
    // Get user profile from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    // If profile exists, use it
    if (profile) {
      const role = profile.role as UserRole;
      return {
        id: supabaseUser.id,
        email: profile.email || supabaseUser.email || '',
        name: profile.name || 'User',
        role: role,
        permissions: rolePermissions[role] || []
      };
    }
    
    // Fallback to metadata if profile doesn't exist
    const role = (supabaseUser.user_metadata?.role as UserRole) || 'patient';
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'User',
      role: role,
      permissions: rolePermissions[role] || []
    };
  } catch (error) {
    console.error('Error mapping Supabase user:', error);
    
    // Fallback to basic mapping
    const role = (supabaseUser.user_metadata?.role as UserRole) || 'patient';
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'User',
      role: role,
      permissions: rolePermissions[role] || []
    };
  }
};

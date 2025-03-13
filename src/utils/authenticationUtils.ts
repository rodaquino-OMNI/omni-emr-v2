
import { Session, Provider } from '@supabase/supabase-js';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { User, UserRole } from '../types/auth';
import { mockUsers } from './mockUsers';
import { mapSupabaseUserToUser } from './userMappingUtils';

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


import { Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '../context/AuthContext';
import { mockUsers } from './mockUsers';

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
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const mapSupabaseUserToUser = (supabaseUser: any): User | null => {
  if (!supabaseUser) return null;
  
  // Check if this is a mock user
  const mockUser = mockUsers.find(u => u.email === supabaseUser.email);
  if (mockUser) return mockUser;
  
  // Map Supabase user to our app's User type
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || 'User',
    role: (supabaseUser.user_metadata?.role as UserRole) || 'patient',
    permissions: []
  };
};

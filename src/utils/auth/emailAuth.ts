
import { Session } from '@supabase/supabase-js';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { User } from '../../types/auth';
import { mockUsers } from '../mockUsers';
import { mapSupabaseUserToUser } from '../userMappingUtils';

export const signInWithEmail = async (email: string, password: string) => {
  try {
    // Check if this is a mock user
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
      password,
      options: {
        captchaToken: window.localStorage.getItem('captcha_token') || undefined,
      }
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
      
      // Store the session expiry time for session management
      if (data.session?.expires_at) {
        const expiryTime = new Date(data.session.expires_at * 1000).toISOString();
        localStorage.setItem('session_expiry', expiryTime);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

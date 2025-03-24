
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../types/auth';
import { mockUsers } from '../mockUsers';

export const signInWithEmail = async (email: string, password: string) => {
  try {
    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Check if this is a mock user
    const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (mockUser) {
      // For demo accounts, check if password is 'password123'
      if (password !== 'password123') {
        throw new Error('Demo accounts require the password "password123". Please use this exact password for demo accounts.');
      }
      
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
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: window.localStorage.getItem('captcha_token') || undefined,
      }
    });
    
    const data = response?.data;
    const error = response?.error;
    
    if (error) throw error;
    
    // If data is null or undefined, create an empty response to prevent destructuring errors
    if (!data) {
      console.warn('Supabase returned null data for email sign-in');
      return { user: null, session: null };
    }
    
    // Store the session expiry time for session management
    if (data.session?.expires_at) {
      const expiryTime = new Date(data.session.expires_at * 1000).toISOString();
      localStorage.setItem('session_expiry', expiryTime);
    }
    
    return {
      user: data?.user || null,
      session: data?.session || null
    };
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

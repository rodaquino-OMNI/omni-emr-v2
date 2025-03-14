
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '../../types/auth';

export const useAuthProviderState = () => {
  // Initialize auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate isAuthenticated based on user existence
  const isAuthenticated = !!user;

  return {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    isAuthenticated
  };
};

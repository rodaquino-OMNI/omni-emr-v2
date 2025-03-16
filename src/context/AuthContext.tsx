import React, { createContext, useContext, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthProvider } from '../hooks/useAuthProvider';
import { User, Languages, UserRole, ApprovalStatus, AuthContextType } from '../types/auth';
import { supabase } from '../integrations/supabase/client';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: true,
  setIsLoading: () => {},
  language: 'en',
  setLanguage: () => {},
  login: async (email: string, password: string) => ({ success: false }),
  logout: async () => {},
  loginWithSocial: async (provider: string) => ({ success: false }),
  signUp: async () => ({ success: false }),
  resetPassword: async (email: string): Promise<{success: boolean; error?: any}> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error };
    }
  },
  updateUser: async () => {},
  checkAuthStatus: async () => false,
  hasPermission: () => false,
  canAccessPatientData: () => false,
  session: null,
  lastActivity: new Date(),
  updateLastActivity: () => {},
  sessionTimeoutMinutes: 30,
  setSessionTimeoutMinutes: () => {},
});

// Create the auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Create the hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export type { User, Languages, UserRole, ApprovalStatus };

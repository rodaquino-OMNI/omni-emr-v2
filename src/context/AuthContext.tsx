
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthProvider } from '../hooks/useAuthProvider';
import { User, Languages, UserRole, ApprovalStatus, AuthContextType } from '../types/auth';
import { supabase } from '../integrations/supabase/client';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  updateProfile: async () => {},
  setError: () => {},
  hasPermission: () => false,
  canAccessPatientData: () => false,
  language: 'en',
  setLanguage: () => {},
  loginWithSocial: async () => ({ success: false }),
  session: null,
  lastActivity: new Date(),
  updateLastActivity: () => {},
  sessionTimeoutMinutes: 30,
  setSessionTimeoutMinutes: () => {},
  signUp: async () => ({ success: false }),
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

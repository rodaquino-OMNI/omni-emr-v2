import React, { createContext, useContext, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthProvider } from '../hooks/useAuthProvider';
import { User, Language, UserRole, ApprovalStatus, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: true,
  setIsLoading: () => {},
  login: async (email: string, password: string) => ({ success: false }),
  logout: async () => {},
  signUp: async () => ({ success: false }),
  resetPassword: async (email: string): Promise<{ success: boolean; error?: any }> => {
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
  sendPasswordResetEmail: async () => {},
  verifyEmail: async () => {},
  refreshSession: async () => {},
  checkAuthStatus: async () => false,
  isMFAEnabled: false,
  setIsMFAEnabled: () => {},
  verifyMFA: async () => false,
  setupMFA: async () => '',
  disableMFA: async () => {},
  lastActivity: new Date(),
  updateLastActivity: () => {},
  sessionTimeoutMinutes: 30,
  setSessionTimeoutMinutes: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  
  const updateLastActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  const value = {
    ...auth,
    lastActivity,
    updateLastActivity,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export type { User, Language, UserRole, ApprovalStatus };

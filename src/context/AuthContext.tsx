
import React, { createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuthProvider } from '../hooks/useAuthProvider';
import { User, Language, UserRole, ApprovalStatus, AuthContextType } from '../types/auth';

// Create context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Use the auth provider hook to get all auth-related functionality
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  // Throw a clear error if context is used outside of provider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export types
export type { User, Language, UserRole, ApprovalStatus };

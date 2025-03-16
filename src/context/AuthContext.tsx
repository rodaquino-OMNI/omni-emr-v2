
import React, { createContext, useContext } from 'react';
import { Session, Provider, AuthError } from '@supabase/supabase-js';
import { useAuthProvider } from '../hooks/useAuthProvider';
import { User, Language, UserRole, ApprovalStatus } from '../types/auth';

// Define our context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    pendingApproval?: boolean;
    error?: AuthError;
  }>;
  loginWithSocial: (provider: Provider) => Promise<{
    success: boolean;
    error?: AuthError;
  }>;
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error?: AuthError;
  }>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{
    success: boolean;
    user: User | null;
    session: Session | null;
    error?: AuthError;
  }>;
  logout: () => Promise<void>;
  session: Session | null;
  hasPermission: (permission: string) => boolean;
  canAccessPatientData: (patientId: string) => boolean;
  lastActivity?: number;
  sessionTimeoutMinutes?: number;
  setSessionTimeoutMinutes?: (minutes: number) => void;
}

// Create context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Use the auth provider hook to get all auth-related functionality
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth as unknown as AuthContextType}>
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
export { User, Language, UserRole, ApprovalStatus };

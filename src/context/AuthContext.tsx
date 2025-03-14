
import React, { createContext, useContext } from 'react';
import { Session, Provider, AuthError } from '@supabase/supabase-js';
import { User, UserRole, Language } from '../types/auth';
import { useAuthProvider } from '../hooks/useAuthProvider';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    error?: AuthError;
  }>;
  loginWithSocial: (provider: Provider) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  logout: () => Promise<void>;
  session: Session | null;
  hasPermission: (permission: string) => boolean;
  canAccessPatientData: (patientId: string) => boolean;
}

// Create context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Use the auth provider hook to get all auth-related functionality
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth as AuthContextType}>
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

// Re-export types for convenience
export type { User, UserRole };
export type { Language };

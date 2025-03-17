
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from '../hooks/useAuthProvider';
import { User, Languages, UserRole, ApprovalStatus, AuthContextType } from '../types/auth';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => ({ success: false }),
  logout: async () => {},
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
    <AuthContext.Provider value={{
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      error: null,
      login: auth.login,
      logout: auth.logout,
      resetPassword: auth.resetPassword,
      updateProfile: async () => {},
      setError: () => {},
      hasPermission: auth.hasPermission,
      canAccessPatientData: auth.canAccessPatientData,
      language: auth.language,
      setLanguage: auth.setLanguage,
      loginWithSocial: auth.loginWithSocial,
      session: auth.session,
      lastActivity: auth.lastActivity,
      updateLastActivity: auth.updateLastActivity,
      sessionTimeoutMinutes: auth.sessionTimeoutMinutes,
      setSessionTimeoutMinutes: auth.setSessionTimeoutMinutes,
      signUp: auth.signUp
    }}>
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

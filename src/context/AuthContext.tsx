
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Session, Provider } from '@supabase/supabase-js';
import { signInWithProvider, signInWithEmail, signUpWithEmail, signOut, mapSupabaseUserToUser, rolePermissions } from '../utils/authUtils';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'caregiver' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'en' | 'pt';
  setLanguage: (lang: 'en' | 'pt') => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: Provider) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
  hasPermission: (permission: string) => boolean;
  canAccessPatientData: (patientId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'pt'>('pt'); // Changed default to 'pt'
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30); // Default timeout

  // Update last activity timestamp on user interaction
  useEffect(() => {
    const updateActivityTimestamp = () => {
      setLastActivity(Date.now());
    };
    
    // Listen for user activity events
    window.addEventListener('click', updateActivityTimestamp);
    window.addEventListener('keypress', updateActivityTimestamp);
    window.addEventListener('scroll', updateActivityTimestamp);
    window.addEventListener('mousemove', updateActivityTimestamp);
    
    return () => {
      window.removeEventListener('click', updateActivityTimestamp);
      window.removeEventListener('keypress', updateActivityTimestamp);
      window.removeEventListener('scroll', updateActivityTimestamp);
      window.removeEventListener('mousemove', updateActivityTimestamp);
    };
  }, []);

  // Auto-logout for session timeout (HIPAA compliance)
  useEffect(() => {
    if (!user) return;
    
    const intervalId = setInterval(() => {
      const now = Date.now();
      const inactiveTime = (now - lastActivity) / (1000 * 60); // Convert to minutes
      
      if (inactiveTime >= sessionTimeoutMinutes) {
        console.log('Session timeout - logging out');
        logout();
      } else if (inactiveTime >= sessionTimeoutMinutes - 5) {
        // Show a warning 5 minutes before timeout
        console.log('Session expiring soon - 5 minute warning');
        // In a real app, show a popup/toast here
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user, lastActivity, sessionTimeoutMinutes]);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as 'en' | 'pt' | null;
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Initialize Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sessionData) => {
        setSession(sessionData);
        setIsLoading(true);
        
        if (sessionData?.user) {
          const mappedUser = mapSupabaseUserToUser(sessionData.user);
          setUser(mappedUser);
          
          // Log session events for HIPAA compliance audit
          if (mappedUser && event === 'SIGNED_IN') {
            await logAuditEvent(
              mappedUser.id,
              'session_start',
              'auth',
              mappedUser.id,
              { role: mappedUser.role, permissions: mappedUser.permissions }
            );
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true);
      
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      
      if (initialSession?.user) {
        const mappedUser = mapSupabaseUserToUser(initialSession.user);
        setUser(mappedUser);
        
        // Log session resumption event
        if (mappedUser) {
          await logAuditEvent(
            mappedUser.id,
            'session_resume',
            'auth',
            mappedUser.id,
            { role: mappedUser.role }
          );
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { user: authUser, session: authSession } = await signInWithEmail(email, password);
      
      if (authUser) {
        // For mock users, authUser will already be our User type
        if ('role' in authUser) {
          setUser(authUser as unknown as User);
        } else {
          const mappedUser = mapSupabaseUserToUser(authUser);
          setUser(mappedUser);
        }
        
        setSession(authSession);
        
        // Reset activity timer on login
        setLastActivity(Date.now());
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: Provider) => {
    try {
      await signInWithProvider(provider);
      // No need to set user or session here, the auth state change listener will handle it
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      await signUpWithEmail(email, password, name, role);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Log session end event
      if (user) {
        await logAuditEvent(
          user.id,
          'session_end',
          'auth',
          user.id,
          { role: user.role }
        );
      }
      
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to check if the current user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admins have all permissions
    if (user.role === 'admin' || user.permissions.includes('all')) {
      return true;
    }
    
    return user.permissions.includes(permission);
  };

  // Function to check if the current user can access a specific patient's data
  const canAccessPatientData = (patientId: string): boolean => {
    if (!user) return false;
    
    // Admins, doctors, and nurses can access all patient data
    if (user.role === 'admin' || user.role === 'doctor' || user.role === 'nurse') {
      return true;
    }
    
    // Patients can only access their own data
    if (user.role === 'patient') {
      return user.id === patientId;
    }
    
    // Caregivers would need a specific association with the patient
    // This would require a caregivers_patients table in a real application
    return false;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        language,
        setLanguage,
        login, 
        loginWithSocial,
        signUp,
        logout,
        session,
        hasPermission,
        canAccessPatientData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

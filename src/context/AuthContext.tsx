
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, Provider } from '@supabase/supabase-js';
import { signInWithProvider, signInWithEmail, signUpWithEmail, signOut, mapSupabaseUserToUser } from '../utils/authUtils';

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
  language: 'en' | 'pt' | 'es';
  setLanguage: (lang: 'en' | 'pt' | 'es') => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: Provider) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'pt' | 'es'>('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as 'en' | 'pt' | 'es' | null;
    
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
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        session
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


import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@medcare.com',
    name: 'Admin User',
    role: 'admin',
    permissions: ['all']
  },
  {
    id: '2',
    email: 'doctor@medcare.com',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    permissions: ['view_patients', 'edit_patients', 'prescribe_medications', 'view_records', 'edit_records', 'schedule_appointments', 'telemedicine']
  },
  {
    id: '3',
    email: 'nurse@medcare.com',
    name: 'Nurse Johnson',
    role: 'nurse',
    permissions: ['view_patients', 'edit_patients', 'view_medications', 'view_records', 'schedule_appointments']
  }
];

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
          // For demo, map to mock users based on email
          // In a real app, you would fetch the user profile from your database
          const mockUser = mockUsers.find(u => u.email === sessionData.user?.email);
          
          if (mockUser) {
            setUser(mockUser);
          } else {
            // Default user if no mock user matches
            setUser({
              id: sessionData.user.id,
              email: sessionData.user.email || '',
              name: sessionData.user.user_metadata.name || 'User',
              role: (sessionData.user.user_metadata.role as UserRole) || 'patient',
              permissions: []
            });
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
        // For demo, map to mock users based on email
        const mockUser = mockUsers.find(u => u.email === initialSession.user.email);
        
        if (mockUser) {
          setUser(mockUser);
        } else {
          // Default user if no mock user matches
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            name: initialSession.user.user_metadata.name || 'User',
            role: (initialSession.user.user_metadata.role as UserRole) || 'patient',
            permissions: []
          });
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
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

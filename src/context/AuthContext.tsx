
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'pt' | 'es'>('en');

  useEffect(() => {
    // Check for saved session on component mount
    const savedUser = localStorage.getItem('user');
    const savedLanguage = localStorage.getItem('language') as 'en' | 'pt' | 'es' | null;
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    setIsLoading(false);
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user by email (mock authentication)
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
        logout 
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

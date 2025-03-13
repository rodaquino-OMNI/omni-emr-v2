import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { Session, Provider } from '@supabase/supabase-js';
import { signInWithProvider, signInWithEmail, signUpWithEmail, signOut, mapSupabaseUserToUser, rolePermissions } from '../utils/authUtils';
import { secureStorage } from '../utils/secureStorage';
import { toast } from 'sonner';
import { AlertTriangle, Clock } from 'lucide-react';

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

// CSRF protection token
const generateCSRFToken = (): string => {
  const token = Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
  secureStorage.setItem('csrf_token', token);
  return token;
};

// Rate limiting for auth attempts
const MAX_AUTH_ATTEMPTS = 5;
const AUTH_LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'pt'>(() => {
    return secureStorage.getItem('language', 'pt');
  });
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30); // Default timeout
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [loginLockoutUntil, setLoginLockoutUntil] = useState<number | null>(null);
  const timeoutWarningRef = useRef<number | null>(null);
  const activityTimeoutRef = useRef<number | null>(null);
  const sessionTimeoutRef = useRef<number | null>(null);
  const [showingTimeoutWarning, setShowingTimeoutWarning] = useState(false);

  // Clear timeout references on component unmount
  useEffect(() => {
    return () => {
      if (timeoutWarningRef.current) window.clearTimeout(timeoutWarningRef.current);
      if (activityTimeoutRef.current) window.clearInterval(activityTimeoutRef.current);
      if (sessionTimeoutRef.current) window.clearTimeout(sessionTimeoutRef.current);
    };
  }, []);

  // Update last activity timestamp on user interaction
  useEffect(() => {
    const updateActivityTimestamp = () => {
      setLastActivity(Date.now());
      
      // If there was a timeout warning showing, hide it since the user is active
      if (showingTimeoutWarning) {
        setShowingTimeoutWarning(false);
        toast.dismiss('session-timeout-warning');
      }
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
  }, [showingTimeoutWarning]);

  // Auto-logout for session timeout (HIPAA compliance)
  useEffect(() => {
    if (!user) return;
    
    // Clear any existing intervals/timeouts
    if (activityTimeoutRef.current) window.clearInterval(activityTimeoutRef.current);
    if (timeoutWarningRef.current) window.clearTimeout(timeoutWarningRef.current);
    if (sessionTimeoutRef.current) window.clearTimeout(sessionTimeoutRef.current);
    
    activityTimeoutRef.current = window.setInterval(() => {
      const now = Date.now();
      const inactiveTime = (now - lastActivity) / (1000 * 60); // Convert to minutes
      
      if (inactiveTime >= sessionTimeoutMinutes) {
        // Auto logout
        console.log('Session timeout - logging out');
        toast.dismiss('session-timeout-warning');
        setShowingTimeoutWarning(false);
        logout();
      } else if (inactiveTime >= sessionTimeoutMinutes - 5 && !showingTimeoutWarning) {
        // Show a warning 5 minutes before timeout
        setShowingTimeoutWarning(true);
        
        const warningMessage = language === 'pt' 
          ? 'Sua sessão expirará em 5 minutos por inatividade. Clique em qualquer lugar para continuar.'
          : 'Your session will expire in 5 minutes due to inactivity. Click anywhere to stay logged in.';
        
        toast.warning(warningMessage, {
          id: 'session-timeout-warning',
          duration: Infinity,
          icon: <Clock className="h-5 w-5" />,
          action: {
            label: language === 'pt' ? 'Continuar sessão' : 'Stay logged in',
            onClick: () => {
              setLastActivity(Date.now());
              setShowingTimeoutWarning(false);
            }
          }
        });
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      if (activityTimeoutRef.current) window.clearInterval(activityTimeoutRef.current);
      if (timeoutWarningRef.current) window.clearTimeout(timeoutWarningRef.current);
      if (sessionTimeoutRef.current) window.clearTimeout(sessionTimeoutRef.current);
    };
  }, [user, lastActivity, sessionTimeoutMinutes, language, showingTimeoutWarning]);

  useEffect(() => {
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
            
            // Generate a new CSRF token on sign in
            generateCSRFToken();
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
          
          // Ensure there's a valid CSRF token
          if (!secureStorage.getItem('csrf_token')) {
            generateCSRFToken();
          }
        }
      }
      
      // Load stored login attempts and lockout time
      const storedAttempts = secureStorage.getItem<number>('login_attempts', 0);
      const storedLockoutUntil = secureStorage.getItem<number>('login_lockout_until', null);
      
      if (storedLockoutUntil && storedLockoutUntil > Date.now()) {
        setLoginAttempts(storedAttempts);
        setLoginLockoutUntil(storedLockoutUntil);
      } else if (storedLockoutUntil) {
        // If lockout period has expired, clear it
        secureStorage.removeItem('login_attempts');
        secureStorage.removeItem('login_lockout_until');
        setLoginAttempts(0);
        setLoginLockoutUntil(null);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Save language preference to secured storage when it changes
  useEffect(() => {
    secureStorage.setItem('language', language);
  }, [language]);

  const handleLoginRateLimit = useCallback(() => {
    // Check if currently locked out
    if (loginLockoutUntil && loginLockoutUntil > Date.now()) {
      const remainingSeconds = Math.ceil((loginLockoutUntil - Date.now()) / 1000);
      const message = language === 'pt'
        ? `Tentativas de login excedidas. Tente novamente em ${remainingSeconds} segundos.`
        : `Too many login attempts. Try again in ${remainingSeconds} seconds.`;
      
      toast.error(message, {
        icon: <AlertTriangle className="h-5 w-5" />,
        duration: 5000
      });
      
      throw new Error(message);
    }
    
    // Increment login attempts
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    secureStorage.setItem('login_attempts', newAttempts);
    
    // If exceeded max attempts, lock account
    if (newAttempts >= MAX_AUTH_ATTEMPTS) {
      const lockoutUntil = Date.now() + AUTH_LOCKOUT_TIME;
      setLoginLockoutUntil(lockoutUntil);
      secureStorage.setItem('login_lockout_until', lockoutUntil);
      
      const message = language === 'pt'
        ? 'Muitas tentativas de login. Conta temporariamente bloqueada por 15 minutos.'
        : 'Too many login attempts. Account temporarily locked for 15 minutes.';
      
      toast.error(message, {
        icon: <AlertTriangle className="h-5 w-5" />,
        duration: 8000
      });
      
      throw new Error(message);
    }
  }, [loginAttempts, loginLockoutUntil, language]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check rate limiting
      handleLoginRateLimit();
      
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
        
        // Reset login attempts on successful login
        setLoginAttempts(0);
        setLoginLockoutUntil(null);
        secureStorage.removeItem('login_attempts');
        secureStorage.removeItem('login_lockout_until');
        
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
      // Generate new CSRF token for the oauth flow
      generateCSRFToken();
      
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
      
      // Clear all timeouts and intervals
      if (timeoutWarningRef.current) window.clearTimeout(timeoutWarningRef.current);
      if (activityTimeoutRef.current) window.clearInterval(activityTimeoutRef.current);
      if (sessionTimeoutRef.current) window.clearTimeout(sessionTimeoutRef.current);
      
      await signOut();
      setUser(null);
      setSession(null);
      // Keep CSRF token in storage until new login
    } catch (error) {
      console.error('Logout error:', error);
      // Still attempt to clear session on frontend even if server logout fails
      setUser(null);
      setSession(null);
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

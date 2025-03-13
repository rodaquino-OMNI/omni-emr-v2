import { useState, useEffect, useCallback } from 'react';
import { Session, Provider } from '@supabase/supabase-js';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { signInWithProvider, signInWithEmail, signUpWithEmail, signOut, mapSupabaseUserToUser } from '../utils/authUtils';
import { secureStorage } from '../utils/secureStorage';
import { User, UserRole, Language } from '../types/auth';
import { useSessionTimeout } from './useSessionTimeout';
import { useAuthRateLimiting } from './useAuthRateLimiting';
import { usePermissions } from './usePermissions';

// CSRF protection token
const generateCSRFToken = (): string => {
  const token = Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
  secureStorage.setItem('csrf_token', token);
  return token;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    return secureStorage.getItem('language', 'pt');
  });

  // Initialize auth rate limiting
  const { 
    handleLoginRateLimit, 
    resetLoginAttempts 
  } = useAuthRateLimiting(language);

  // Initialize permissions
  const { hasPermission, canAccessPatientData } = usePermissions(user);

  // Session timeout handling
  const handleLogout = useCallback(async () => {
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
      // Keep CSRF token in storage until new login
    } catch (error) {
      console.error('Logout error:', error);
      // Still attempt to clear session on frontend even if server logout fails
      setUser(null);
      setSession(null);
    }
  }, [user]);

  const { 
    lastActivity, 
    sessionTimeoutMinutes, 
    setSessionTimeoutMinutes 
  } = useSessionTimeout({
    isAuthenticated: !!user,
    language,
    onTimeout: handleLogout
  });

  // Save language preference to secured storage when it changes
  useEffect(() => {
    secureStorage.setItem('language', language);
  }, [language]);

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
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
        resetLoginAttempts();
        
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

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    language,
    setLanguage,
    login,
    loginWithSocial,
    signUp,
    logout: handleLogout,
    session,
    hasPermission,
    canAccessPatientData,
    lastActivity,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes
  };
};

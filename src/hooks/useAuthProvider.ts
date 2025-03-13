
import { useState, useEffect, useCallback } from 'react';
import { Session, Provider } from '@supabase/supabase-js';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { signInWithProvider, signInWithEmail, signUpWithEmail, signOut, mapSupabaseUserToUser } from '../utils/authUtils';
import { secureStorage } from '../utils/secureStorage';
import { User, UserRole, Language } from '../types/auth';
import { useSessionTimeout } from './useSessionTimeout';
import { useAuthRateLimiting } from './useAuthRateLimiting';
import { usePermissions } from './usePermissions';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

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
    return secureStorage.getItem('language', 'pt') as Language;
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
        try {
          await logAuditEvent(
            user.id,
            'session_end',
            'auth',
            user.id,
            { role: user.role }
          );
        } catch (error) {
          console.error('Failed to log session end event:', error);
          // No need to throw here, we still want to complete the logout
        }
      }
      
      await signOut();
      setUser(null);
      setSession(null);
      
      // Show logout notification
      toast.success(language === 'pt' ? 'Você saiu com sucesso' : 'You have been logged out', {
        duration: 3000
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Show error to user
      toast.error(language === 'pt' ? 'Erro ao sair' : 'Logout error', {
        description: language === 'pt' 
          ? 'Ocorreu um erro ao tentar sair. Tente novamente.'
          : 'An error occurred while trying to log out. Please try again.',
        icon: <AlertTriangle className="h-5 w-5" />
      });
      
      // Still attempt to clear session on frontend even if server logout fails
      setUser(null);
      setSession(null);
    }
  }, [user, language]);

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
            try {
              await logAuditEvent(
                mappedUser.id,
                'session_start',
                'auth',
                mappedUser.id,
                { role: mappedUser.role, permissions: mappedUser.permissions }
              );
            } catch (error) {
              console.error('Failed to log session start event:', error);
              // Don't throw here, we still want to complete the sign-in process
            }
            
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
      
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession?.user) {
          const mappedUser = mapSupabaseUserToUser(initialSession.user);
          setUser(mappedUser);
          
          // Log session resumption event
          if (mappedUser) {
            try {
              await logAuditEvent(
                mappedUser.id,
                'session_resume',
                'auth',
                mappedUser.id,
                { role: mappedUser.role }
              );
            } catch (error) {
              console.error('Failed to log session resume event:', error);
              // Don't throw here, as we still want to resume the session
            }
            
            // Ensure there's a valid CSRF token
            if (!secureStorage.getItem('csrf_token')) {
              generateCSRFToken();
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        
        toast.error(language === 'pt' 
          ? 'Erro ao inicializar autenticação' 
          : 'Authentication initialization error', {
          icon: <AlertTriangle className="h-5 w-5" />
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [language]);

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
      } else {
        throw new Error(language === 'pt' 
          ? 'Falha ao fazer login: Credenciais inválidas' 
          : 'Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error; // Let the component handle the error display
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: Provider) => {
    try {
      // Generate new CSRF token for the OAuth flow
      generateCSRFToken();
      
      await signInWithProvider(provider);
      // No need to set user or session here, the auth state change listener will handle it
    } catch (error) {
      console.error('Social login error:', error);
      
      // Display error to user
      toast.error(language === 'pt'
        ? 'Erro de login social'
        : 'Social login error', {
        description: language === 'pt' 
          ? `Não foi possível fazer login com ${provider}.`
          : `Could not sign in with ${provider}.`,
        icon: <AlertTriangle className="h-5 w-5" />
      });
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      await signUpWithEmail(email, password, name, role);
      
      // Show success message
      toast.success(language === 'pt' 
        ? 'Registro bem-sucedido!' 
        : 'Registration successful!', {
        description: language === 'pt'
          ? 'Sua conta foi criada. Verifique seu email para confirmar.'
          : 'Your account has been created. Please check your email to confirm.'
      });
    } catch (error) {
      console.error('Signup error:', error);
      
      // Show error to user via toast (component will also display the error)
      toast.error(language === 'pt' ? 'Erro de registro' : 'Registration error', {
        icon: <AlertTriangle className="h-5 w-5" />
      });
      
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
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


import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, Language } from '../types/auth';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { mapSupabaseUserToUser } from '../utils/authUtils';
import { generateCSRFToken } from '../utils/csrfUtils';
import { secureStorage } from '../utils/secureStorage';
import { toast } from 'sonner';

export const useAuthState = (language: Language) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sessionData) => {
        setSession(sessionData);
        setIsLoading(true);
        
        if (sessionData?.user) {
          try {
            const mappedUser = await mapSupabaseUserToUser(sessionData.user);
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
          } catch (error) {
            console.error('Error mapping user:', error);
            setUser(null);
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
          const mappedUser = await mapSupabaseUserToUser(initialSession.user);
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
            if (!secureStorage.getItem('csrf_token', null)) {
              generateCSRFToken();
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        
        toast.error(language === 'pt' 
          ? 'Erro ao inicializar autenticação' 
          : 'Authentication initialization error');
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

  return {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading
  };
};

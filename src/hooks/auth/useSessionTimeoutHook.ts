
import { useState, useEffect, useCallback } from 'react';
import { Language } from '@/types/auth';
import { toast } from 'sonner';

interface UseSessionTimeoutProps {
  isAuthenticated: boolean;
  language: Language;
  onTimeout: () => Promise<void>;
  defaultTimeoutMinutes?: number; 
}

export const useSessionTimeoutHook = ({
  isAuthenticated,
  language,
  onTimeout,
  defaultTimeoutMinutes = 30
}: UseSessionTimeoutProps) => {
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(
    // Try to get from localStorage first, then use default
    (() => {
      try {
        const saved = localStorage.getItem('session_timeout_minutes');
        return saved ? parseInt(saved, 10) : defaultTimeoutMinutes;
      } catch (e) {
        return defaultTimeoutMinutes;
      }
    })()
  );
  
  // Update the last activity timestamp
  const updateLastActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);
  
  // Effect to set up the session timeout monitoring
  useEffect(() => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }
    
    // Save timeout preference to localStorage
    try {
      localStorage.setItem('session_timeout_minutes', sessionTimeoutMinutes.toString());
    } catch (e) {
      console.error('Error saving session timeout to localStorage:', e);
    }
    
    // Set up interval to check session timeout
    const interval = setInterval(() => {
      const now = new Date();
      const inactiveTime = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
      
      // If user has been inactive for longer than the timeout, log them out
      if (inactiveTime >= sessionTimeoutMinutes) {
        toast.info(
          language === 'pt' ? 'Sessão expirada' : 'Session expired',
          {
            description: language === 'pt'
              ? 'Sua sessão expirou devido à inatividade.'
              : 'Your session has expired due to inactivity.',
            duration: 5000
          }
        );
        
        // Log the user out
        onTimeout();
      }
      
      // If timeout is approaching, warn the user
      if (inactiveTime >= sessionTimeoutMinutes - 2 && inactiveTime < sessionTimeoutMinutes) {
        toast.warning(
          language === 'pt' ? 'Alerta de sessão' : 'Session alert',
          {
            description: language === 'pt'
              ? 'Sua sessão expirará em breve por inatividade.'
              : 'Your session will expire soon due to inactivity.',
            duration: 5000
          }
        );
      }
    }, 30000); // Check every 30 seconds
    
    // Set up event listeners to update last activity
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleUserActivity = () => {
      updateLastActivity();
    };
    
    // Add all the event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Cleanup function
    return () => {
      clearInterval(interval);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, sessionTimeoutMinutes, lastActivity, language, onTimeout, updateLastActivity]);
  
  return {
    lastActivity,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes,
    updateLastActivity
  };
};

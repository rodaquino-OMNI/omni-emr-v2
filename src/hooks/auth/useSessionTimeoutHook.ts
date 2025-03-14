
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Language } from '../../types/auth';

interface UseSessionTimeoutHookProps {
  isAuthenticated: boolean;
  language: Language;
  onTimeout: () => Promise<void>;
}

export const useSessionTimeoutHook = ({ 
  isAuthenticated, 
  language, 
  onTimeout 
}: UseSessionTimeoutHookProps) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30); // Default timeout
  const [showingTimeoutWarning, setShowingTimeoutWarning] = useState(false);
  
  const timeoutWarningRef = useRef<number | null>(null);
  const activityTimeoutRef = useRef<number | null>(null);
  const sessionTimeoutRef = useRef<number | null>(null);

  // Update last activity timestamp on user interaction
  useEffect(() => {
    if (!isAuthenticated) return;
    
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
  }, [isAuthenticated, showingTimeoutWarning]);

  // Auto-logout for session timeout (HIPAA compliance)
  useEffect(() => {
    if (!isAuthenticated) return;
    
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
        onTimeout();
      } else if (inactiveTime >= sessionTimeoutMinutes - 5 && !showingTimeoutWarning) {
        // Show a warning 5 minutes before timeout
        setShowingTimeoutWarning(true);
        
        const warningMessage = language === 'pt' 
          ? 'Sua sessão expirará em 5 minutos por inatividade. Clique em qualquer lugar para continuar.'
          : 'Your session will expire in 5 minutes due to inactivity. Click anywhere to stay logged in.';
        
        toast.warning(warningMessage, {
          id: 'session-timeout-warning',
          duration: Infinity,
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
  }, [isAuthenticated, lastActivity, sessionTimeoutMinutes, language, showingTimeoutWarning, onTimeout]);

  return {
    lastActivity,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes
  };
};


import { useState, useEffect, useCallback } from 'react';
import { UseSessionTimeoutProps } from '@/types/auth';

export const useSessionTimeoutHook = ({
  timeoutMinutes,
  onTimeout,
  onWarning,
  warningMinutesBefore = 5,
  isAuthenticated,
  language,
  defaultTimeoutMinutes = 30
}: UseSessionTimeoutProps) => {
  // State for tracking last activity time and timeout configuration
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(
    timeoutMinutes || defaultTimeoutMinutes
  );

  // Update last activity timestamp
  const updateLastActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Set up event listeners for user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    // Update last activity on user interaction
    const handleUserActivity = () => {
      updateLastActivity();
    };

    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, updateLastActivity]);

  // Set up timeout monitoring
  useEffect(() => {
    if (!isAuthenticated) return;

    const warningTimeoutMs = (sessionTimeoutMinutes - warningMinutesBefore) * 60 * 1000;
    const timeoutMs = sessionTimeoutMinutes * 60 * 1000;

    // Check for approaching timeout (to show warning)
    const warningInterval = setInterval(() => {
      const now = new Date();
      const timeSinceLastActivity = now.getTime() - lastActivity.getTime();

      if (timeSinceLastActivity >= warningTimeoutMs && timeSinceLastActivity < timeoutMs) {
        // Show warning if callback provided
        if (onWarning) {
          onWarning();
        }
      }
    }, 30000); // Check every 30 seconds

    // Check for actual timeout
    const timeoutInterval = setInterval(() => {
      const now = new Date();
      const timeSinceLastActivity = now.getTime() - lastActivity.getTime();

      if (timeSinceLastActivity >= timeoutMs && onTimeout) {
        onTimeout();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(warningInterval);
      clearInterval(timeoutInterval);
    };
  }, [
    isAuthenticated,
    lastActivity,
    sessionTimeoutMinutes,
    warningMinutesBefore,
    onWarning,
    onTimeout
  ]);

  return {
    lastActivity,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes,
    updateLastActivity
  };
};

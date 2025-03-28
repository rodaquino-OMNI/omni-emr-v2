
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { secureStorage } from '../utils/secureStorage';
import { Languages } from '../types/auth';

// Rate limiting for auth attempts
const MAX_AUTH_ATTEMPTS = 5;
const AUTH_LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export const useAuthRateLimiting = (language: Languages) => {
  const [loginAttempts, setLoginAttempts] = useState<number>(() => {
    return secureStorage.getItem('login_attempts', 0);
  });
  
  const [loginLockoutUntil, setLoginLockoutUntil] = useState<number | null>(() => {
    const storedLockoutUntil = secureStorage.getItem<number>('login_lockout_until', null);
    
    if (storedLockoutUntil && storedLockoutUntil > Date.now()) {
      return storedLockoutUntil;
    } else if (storedLockoutUntil) {
      // If lockout period has expired, clear it
      secureStorage.removeItem('login_attempts');
      secureStorage.removeItem('login_lockout_until');
      return null;
    }
    
    return null;
  });

  // Periodically check if lockout has expired
  useEffect(() => {
    if (!loginLockoutUntil) return;
    
    const checkLockoutInterval = setInterval(() => {
      if (loginLockoutUntil && loginLockoutUntil <= Date.now()) {
        setLoginLockoutUntil(null);
        setLoginAttempts(0);
        secureStorage.removeItem('login_attempts');
        secureStorage.removeItem('login_lockout_until');
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkLockoutInterval);
  }, [loginLockoutUntil]);

  const handleLoginRateLimit = useCallback(() => {
    // Check if currently locked out
    if (loginLockoutUntil && loginLockoutUntil > Date.now()) {
      const remainingSeconds = Math.ceil((loginLockoutUntil - Date.now()) / 1000);
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      const remainingSecs = remainingSeconds % 60;
      
      const formattedTime = remainingMinutes > 0 
        ? `${remainingMinutes}m ${remainingSecs}s` 
        : `${remainingSeconds}s`;
      
      const message = language === 'pt'
        ? `Tentativas de login excedidas. Tente novamente em ${formattedTime}.`
        : `Too many login attempts. Try again in ${formattedTime}.`;
      
      toast.error(message, {
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
        duration: 8000
      });
      
      throw new Error(message);
    }
  }, [loginAttempts, loginLockoutUntil, language]);

  const resetLoginAttempts = useCallback(() => {
    setLoginAttempts(0);
    setLoginLockoutUntil(null);
    secureStorage.removeItem('login_attempts');
    secureStorage.removeItem('login_lockout_until');
  }, []);

  // Add a function to check if currently locked out
  const isLockedOut = useCallback(() => {
    return loginLockoutUntil !== null && loginLockoutUntil > Date.now();
  }, [loginLockoutUntil]);

  // Return remaining lockout time in seconds
  const getRemainingLockoutTime = useCallback(() => {
    if (!loginLockoutUntil || loginLockoutUntil <= Date.now()) {
      return 0;
    }
    return Math.ceil((loginLockoutUntil - Date.now()) / 1000);
  }, [loginLockoutUntil]);

  return {
    loginAttempts,
    loginLockoutUntil,
    handleLoginRateLimit,
    resetLoginAttempts,
    isLockedOut,
    getRemainingLockoutTime
  };
};

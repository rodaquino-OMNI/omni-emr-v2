
import { useState, useEffect } from 'react';
import { Languages } from '@/types/auth';

export const useOfflineMode = (isAuthenticated: boolean, language: Languages) => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [checkingConnectivity, setCheckingConnectivity] = useState(true);
  
  useEffect(() => {
    // Check if we're offline
    const checkConnectivity = async () => {
      setCheckingConnectivity(true);
      
      try {
        // Try to fetch a small file to check connectivity
        const response = await fetch('/api/health-check', {
          method: 'HEAD',
          cache: 'no-store',
          headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          }
        });
        
        // If we get a response, we're online
        setIsOfflineMode(false);
      } catch (error) {
        // If we get an error, we're offline
        console.log('Network check failed, switching to offline mode');
        setIsOfflineMode(true);
      } finally {
        setCheckingConnectivity(false);
      }
    };
    
    // Only check connectivity if the user is not authenticated
    // For authenticated users, we'll rely on the AuthContext's connectivity check
    if (!isAuthenticated) {
      checkConnectivity();
    } else {
      setCheckingConnectivity(false);
    }
    
    // Set up event listeners for online/offline status
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated]);
  
  return {
    isOfflineMode,
    checkingConnectivity
  };
};

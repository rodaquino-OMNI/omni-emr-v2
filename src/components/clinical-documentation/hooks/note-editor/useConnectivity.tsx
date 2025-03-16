
import { useState, useEffect } from 'react';

export const useConnectivity = () => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    const checkConnectivity = () => {
      setIsOfflineMode(!navigator.onLine);
    };
    
    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', checkConnectivity);
    checkConnectivity();
    
    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', checkConnectivity);
    };
  }, []);

  return { isOfflineMode };
};


import { useState, useEffect } from 'react';
import { checkConnectivity } from '@/utils/supabaseConnectivity';
import { toast } from 'sonner';
import { Language } from '@/types/auth';

export const useOfflineMode = (isAuthenticated: boolean, language: Language) => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [checkingConnectivity, setCheckingConnectivity] = useState(true);

  // Check if we need to enable offline mode
  useEffect(() => {
    const checkConnection = async () => {
      setCheckingConnectivity(true);
      const isConnected = await checkConnectivity();
      
      if (!isConnected) {
        setIsOfflineMode(true);
        console.log("Enabling offline mode due to connection issues");
        
        if (isAuthenticated) {
          toast.warning(
            language === 'pt' ? 'Modo offline ativado' : 'Offline mode enabled',
            {
              description: language === 'pt'
                ? 'Funcionando com funcionalidades limitadas devido a problemas de conexão.'
                : 'Working with limited functionality due to connection issues.',
              duration: 5000
            }
          );
        }
      }
      
      setCheckingConnectivity(false);
    };
    
    checkConnection();
  }, [isAuthenticated, language]);

  return { isOfflineMode, checkingConnectivity, setIsOfflineMode };
};

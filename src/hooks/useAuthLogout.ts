
import { useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, Languages } from '../types/auth';
import { signOut } from '../utils/authUtils';
import { logAuditEvent } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSectorContext } from '@/hooks/useSectorContext';

export const useAuthLogout = (
  user: User | null,
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  language: Languages
) => {
  // Get sector context always, not conditionally
  const sectorContext = useSectorContext();

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
      
      // Clear sector context if available
      if (sectorContext && sectorContext.selectSector) {
        sectorContext.selectSector(null);
      }
      
      await signOut();
      setUser(null);
      setSession(null);
      
      // Clear any sector selection from local storage
      localStorage.removeItem('selectedSector');
      
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
          : 'An error occurred while trying to log out. Please try again.'
      });
      
      // Still attempt to clear session on frontend even if server logout fails
      setUser(null);
      setSession(null);
      
      // Still clear sector context even if logout fails
      if (sectorContext && sectorContext.selectSector) {
        sectorContext.selectSector(null);
      }
      
      // Still clear local storage even if logout fails
      localStorage.removeItem('selectedSector');
    }
  }, [user, language, setUser, setSession, sectorContext]);

  return { logout: handleLogout };
};

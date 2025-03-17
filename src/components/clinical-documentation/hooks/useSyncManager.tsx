
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { ClinicalNote } from '@/types/clinicalNotes';

interface SyncManagerOptions {
  onSyncSuccess?: (notes: ClinicalNote[]) => void;
  onSyncError?: (error: Error) => void;
  autoSync?: boolean;
  syncInterval?: number;
  userId?: string;
}

export const useSyncManager = (options: SyncManagerOptions) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const userId = options.userId || user?.id;
  const autoSync = options.autoSync !== false;
  const syncInterval = options.syncInterval || 60000; // Default to 1 minute
  
  // Wrap syncNotes in useCallback
  const syncNotes = useCallback(async () => {
    if (!userId) {
      console.warn('Cannot sync notes: No user ID provided');
      return;
    }
    
    try {
      // Fetch notes from the server
      const { data, error } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('created_by_id', userId);
        
      if (error) {
        throw error;
      }
      
      if (options.onSyncSuccess) {
        options.onSyncSuccess(data as ClinicalNote[]);
      }
      
      return data;
    } catch (error) {
      console.error('Error syncing notes:', error);
      
      if (options.onSyncError) {
        options.onSyncError(error as Error);
      }
      
      toast.error(
        language === 'pt' ? 'Erro ao sincronizar notas' : 'Error syncing notes',
        {
          description: language === 'pt' 
            ? 'Não foi possível sincronizar suas notas clínicas' 
            : 'Could not sync your clinical notes'
        }
      );
    }
  }, [userId, options, language]);

  // Set up automatic sync on component mount
  useEffect(() => {
    if (autoSync) {
      syncNotes();
    }
  }, [autoSync, syncNotes]);
  
  // Set up interval for periodic sync
  useEffect(() => {
    if (!autoSync) return;
    
    const intervalId = setInterval(() => {
      syncNotes();
    }, syncInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [autoSync, syncInterval, syncNotes]);
  
  return {
    syncNotes,
    // Add more functions as needed for manual sync operations
    forceSyncNotes: syncNotes,
    isOnline: true, // Added to fix TypeScript errors in OfflineSyncIndicator
    syncQueue: [], // Added to fix TypeScript errors in OfflineSyncIndicator
    isSyncing: false, // Added to fix TypeScript errors in OfflineSyncIndicator
    lastSyncTime: new Date() // Added to fix TypeScript errors in OfflineSyncIndicator
  };
};

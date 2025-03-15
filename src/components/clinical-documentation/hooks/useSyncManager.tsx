
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { offlineStorage } from '@/services/clinicalNotes/offlineStorage';
import { noteService } from '@/services/clinicalNotes/noteService';

export const useSyncManager = () => {
  const { language } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncQueue, setSyncQueue] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update sync queue from localStorage
  useEffect(() => {
    const queue = offlineStorage.getSyncQueue();
    setSyncQueue(queue);
  }, [isOnline]);

  // Try to sync whenever we come back online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      syncNotes();
    }
  }, [isOnline, syncQueue]);

  // Periodic sync attempt (every 5 minutes)
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (isOnline && syncQueue.length > 0) {
        syncNotes();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, [isOnline, syncQueue]);

  const syncNotes = useCallback(async () => {
    if (isSyncing || !isOnline || syncQueue.length === 0) return;

    setIsSyncing(true);
    try {
      const result = await noteService.syncOfflineNotes();
      setLastSyncTime(new Date());
      
      // Update the queue
      const updatedQueue = offlineStorage.getSyncQueue();
      setSyncQueue(updatedQueue);
      
      if (result.success > 0) {
        toast.success(
          language === 'pt' ? 'Sincronização concluída' : 'Synchronization completed',
          {
            description: language === 'pt'
              ? `${result.success} nota(s) sincronizada(s) com sucesso.`
              : `${result.success} note(s) successfully synchronized.`
          }
        );
      }
      
      if (result.failed > 0) {
        toast.error(
          language === 'pt' ? 'Sincronização parcial' : 'Partial synchronization',
          {
            description: language === 'pt'
              ? `${result.failed} nota(s) não puderam ser sincronizadas e serão tentadas novamente.`
              : `${result.failed} note(s) could not be synchronized and will be retried.`
          }
        );
      }
    } catch (error) {
      console.error('Error syncing notes:', error);
      toast.error(
        language === 'pt' ? 'Erro de sincronização' : 'Synchronization error',
        {
          description: language === 'pt'
            ? 'Ocorreu um erro ao sincronizar as notas. Tentaremos novamente mais tarde.'
            : 'An error occurred while synchronizing notes. We will try again later.'
        }
      );
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOnline, syncQueue, language]);

  return {
    isSyncing,
    isOnline,
    syncQueue,
    lastSyncTime,
    syncNotes,
    pendingCount: syncQueue.length
  };
};

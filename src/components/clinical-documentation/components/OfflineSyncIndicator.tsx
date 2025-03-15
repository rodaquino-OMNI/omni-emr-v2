
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSyncManager } from '../hooks/useSyncManager';

const OfflineSyncIndicator = () => {
  const { 
    isOnline, 
    syncQueue, 
    isSyncing, 
    lastSyncTime, 
    syncNotes 
  } = useSyncManager();
  const { language } = useTranslation();
  
  const pendingCount = syncQueue.length;
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isOnline && pendingCount === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Cloud className="h-4 w-4" />
        <span>
          {language === 'pt' 
            ? 'Conectado' 
            : 'Connected'}
          {lastSyncTime && (
            <span className="text-muted-foreground ml-1">
              {language === 'pt'
                ? `(Última sincronização: ${formatTime(lastSyncTime)})`
                : `(Last sync: ${formatTime(lastSyncTime)})`}
            </span>
          )}
        </span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <CloudOff className="h-4 w-4" />
        <span>
          {language === 'pt' 
            ? 'Offline - As alterações serão sincronizadas quando a conexão for restaurada' 
            : 'Offline - Changes will be synced when connection is restored'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-amber-600 flex items-center gap-2">
        <Cloud className="h-4 w-4" />
        <span>
          {language === 'pt'
            ? `${pendingCount} nota(s) pendente(s) de sincronização`
            : `${pendingCount} note(s) pending synchronization`}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2 text-xs" 
        onClick={() => syncNotes()}
        disabled={isSyncing}
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing 
          ? (language === 'pt' ? 'Sincronizando...' : 'Syncing...') 
          : (language === 'pt' ? 'Sincronizar' : 'Sync')}
      </Button>
    </div>
  );
};

export default OfflineSyncIndicator;

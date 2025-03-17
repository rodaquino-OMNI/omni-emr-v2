
import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

// Define proper props interface for the component
interface OfflineSyncIndicatorProps {
  isOnline: boolean;
  isSyncing: boolean;
  syncQueue: any[];
  lastSyncTime: Date;
}

export const OfflineSyncIndicator: React.FC<OfflineSyncIndicatorProps> = ({ 
  isOnline, 
  isSyncing, 
  syncQueue, 
  lastSyncTime 
}) => {
  const { t, language } = useTranslation();
  
  const handleSyncClick = () => {
    // Show toast notification about sync attempt
    toast(language === 'pt' ? 'Sincronizando notas...' : 'Syncing notes...');
  };
  
  return (
    <div className="flex items-center space-x-2 text-xs">
      {isOnline ? (
        <Wifi className="h-4 w-4 text-green-500" />
      ) : (
        <WifiOff className="h-4 w-4 text-amber-500" />
      )}
      
      <span className={isOnline ? "text-green-600" : "text-amber-600"}>
        {isOnline ? t('online') : t('offline')}
      </span>
      
      {!isOnline && syncQueue.length > 0 && (
        <span className="text-muted-foreground">
          ({syncQueue.length} {syncQueue.length === 1 ? t('notePending') : t('notesPending')})
        </span>
      )}
      
      {isSyncing && (
        <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
      )}
      
      {lastSyncTime && (
        <span className="text-muted-foreground">
          {t('lastSync')}: {new Date(lastSyncTime).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

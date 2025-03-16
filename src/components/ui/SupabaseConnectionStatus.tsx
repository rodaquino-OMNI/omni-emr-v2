
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface SupabaseConnectionStatusProps {
  connected: boolean;
}

const SupabaseConnectionStatus: React.FC<SupabaseConnectionStatusProps> = ({ connected }) => {
  const { t } = useTranslation();
  
  if (connected) {
    return (
      <div className="flex items-center text-xs text-green-600 gap-1">
        <Wifi className="h-3 w-3" />
        <span>{t('databaseConnected')}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-xs text-red-600 gap-1">
      <WifiOff className="h-3 w-3" />
      <span>{t('databaseDisconnected')}</span>
    </div>
  );
};

export default SupabaseConnectionStatus;

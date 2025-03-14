
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRxNormStats } from './admin/useRxNormStats';
import RxNormStatsCards from './admin/RxNormStatsCards';
import RxNormActionButtons from './admin/RxNormActionButtons';
import { formatDate } from './admin/dateUtils';

const RxNormAdminPanel: React.FC = () => {
  const { language } = useTranslation();
  const { dbStats, isSyncing, isClearing, handleSync, handleClearCache } = useRxNormStats();

  const formatDateWithLanguage = (date: Date | null) => {
    return formatDate(date, language);
  };

  return (
    <div className="space-y-6">
      <RxNormStatsCards 
        stats={dbStats} 
        formatDate={formatDateWithLanguage} 
      />
      
      <RxNormActionButtons
        isSyncing={isSyncing}
        isClearing={isClearing}
        totalCacheEntries={dbStats.totalCacheEntries}
        onSync={handleSync}
        onClearCache={handleClearCache}
      />
    </div>
  );
};

export default RxNormAdminPanel;

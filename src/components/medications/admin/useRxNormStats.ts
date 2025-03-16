
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchDatabaseStats, DatabaseStats } from './utils/dbUtils';
import { syncMedications, clearCache } from './api/rxnormApi';

export type { DatabaseStats } from './utils/dbUtils';

export const useRxNormStats = () => {
  const { language } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    totalMedications: 0,
    totalMappings: 0,
    totalCacheEntries: 0,
    lastSyncDate: null
  });

  const fetchStats = async () => {
    const stats = await fetchDatabaseStats(language);
    if (stats) {
      setDbStats(stats);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const success = await syncMedications(language);
      if (success) {
        await fetchStats();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    
    try {
      const success = await clearCache(language);
      if (success) {
        await fetchStats();
      }
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    dbStats,
    isSyncing,
    isClearing,
    handleSync,
    handleClearCache
  };
};

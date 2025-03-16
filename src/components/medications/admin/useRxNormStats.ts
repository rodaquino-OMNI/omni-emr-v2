
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { clearExpiredCache, syncFrequentlyUsedMedications } from '@/services/rxnorm';
import { supabase } from '@/integrations/supabase/core';
import { checkConnectivity } from '@/utils/supabaseConnectivity';

export interface DatabaseStats {
  totalMedications: number;
  totalMappings: number;
  totalCacheEntries: number;
  lastSyncDate: Date | null;
}

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
    try {
      // First check connection
      const isConnected = await checkConnectivity();
      if (!isConnected) {
        toast({
          title: language === 'pt' 
            ? 'Erro de conexão com o banco de dados' 
            : 'Database connection error',
          description: language === 'pt'
            ? 'Não foi possível conectar ao banco de dados'
            : 'Could not connect to the database',
          variant: 'error'
        });
        return;
      }
      
      // Check if rxnorm_items table exists using a safe query
      const { data: rxnormItemsExists, error: rxnormCheckError } = await supabase.rpc('check_table_exists', {
        table_name: 'rxnorm_items'
      });
      
      if (rxnormCheckError || !rxnormItemsExists) {
        console.error('Error checking rxnorm_items table:', rxnormCheckError);
        toast({
          title: language === 'pt' 
            ? 'Erro ao verificar tabelas de RxNorm' 
            : 'Error checking RxNorm tables',
          variant: 'error'
        });
        return;
      }

      // Now safely fetch stats from existing tables
      const medCountQuery = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_items?select=count`,
        {
          method: 'HEAD',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        }
      );
      const medCount = parseInt(medCountQuery.headers.get('content-range')?.split('/')[1] || '0');
      
      // Check if rxnorm_anvisa_mappings table exists
      const { data: mappingsTableExists, error: mappingsCheckError } = await supabase.rpc('check_table_exists', {
        table_name: 'rxnorm_anvisa_mappings'
      });
      
      let mappingCount = 0;
      if (mappingsTableExists && !mappingsCheckError) {
        const mappingCountQuery = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_anvisa_mappings?select=count`,
          {
            method: 'HEAD',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'count=exact'
            }
          }
        );
        mappingCount = parseInt(mappingCountQuery.headers.get('content-range')?.split('/')[1] || '0');
      } else {
        console.warn('rxnorm_anvisa_mappings table does not exist or check failed');
      }
      
      // Check if rxnorm_search_cache table exists
      const { data: cacheTableExists, error: cacheCheckError } = await supabase.rpc('check_table_exists', {
        table_name: 'rxnorm_search_cache'
      });
      
      let cacheCount = 0;
      if (cacheTableExists && !cacheCheckError) {
        const cacheCountQuery = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_search_cache?select=count`,
          {
            method: 'HEAD',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'count=exact'
            }
          }
        );
        cacheCount = parseInt(cacheCountQuery.headers.get('content-range')?.split('/')[1] || '0');
      } else {
        console.warn('rxnorm_search_cache table does not exist or check failed');
      }
      
      // Check if rxnorm_sync_log table exists
      const { data: syncLogTableExists, error: syncLogCheckError } = await supabase.rpc('check_table_exists', {
        table_name: 'rxnorm_sync_log'
      });
      
      let lastSyncDate = null;
      if (syncLogTableExists && !syncLogCheckError) {
        const syncLogResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_sync_log?select=sync_date&order=sync_date.desc&limit=1`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const syncLogData = await syncLogResponse.json();
        lastSyncDate = syncLogData.length > 0 ? new Date(syncLogData[0].sync_date) : null;
      } else {
        console.warn('rxnorm_sync_log table does not exist or check failed');
      }
      
      setDbStats({
        totalMedications: medCount || 0,
        totalMappings: mappingCount || 0,
        totalCacheEntries: cacheCount || 0,
        lastSyncDate
      });
    } catch (error) {
      console.error('Error fetching RxNorm database stats:', error);
      toast({
        title: language === 'pt' 
          ? 'Erro ao obter estatísticas do banco de dados' 
          : 'Error fetching database statistics',
        variant: 'error'
      });
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const result = await syncFrequentlyUsedMedications();
      
      if (result.success) {
        toast({
          title: language === 'pt' 
            ? 'Sincronização concluída com sucesso' 
            : 'Synchronization completed successfully',
          description: language === 'pt'
            ? `${result.count} medicamentos sincronizados`
            : `${result.count} medications synchronized`,
          variant: 'success'
        });
        
        fetchStats();
      } else {
        toast({
          title: language === 'pt' 
            ? 'Erro na sincronização' 
            : 'Synchronization error',
          description: language === 'pt'
            ? 'Houve um problema ao sincronizar os dados'
            : 'There was a problem synchronizing the data',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error during synchronization:', error);
      toast({
        title: language === 'pt' 
          ? 'Erro na sincronização' 
          : 'Synchronization error',
        variant: 'error'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    
    try {
      const result = await clearExpiredCache();
      
      if (result.success) {
        toast({
          title: language === 'pt' 
            ? 'Cache limpo com sucesso' 
            : 'Cache cleared successfully',
          variant: 'success'
        });
        
        fetchStats();
      } else {
        toast({
          title: language === 'pt' 
            ? 'Erro ao limpar cache' 
            : 'Error clearing cache',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: language === 'pt' 
          ? 'Erro ao limpar cache' 
          : 'Error clearing cache',
        variant: 'error'
      });
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

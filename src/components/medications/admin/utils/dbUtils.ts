import { supabase } from '@/integrations/supabase/core';
import { checkConnectivity } from '@/utils/supabaseConnectivity';
import { toast } from '@/hooks/use-toast';
import { Languages } from '@/types/auth';

export interface DatabaseStats {
  totalMedications: number;
  totalMappings: number;
  totalCacheEntries: number;
  lastSyncDate: Date | null;
}

/**
 * Checks if a specific table exists in the database
 */
export const checkTableExists = async (tableName: string) => {
  const { data, error } = await supabase.rpc('check_table_exists', {
    table_name: tableName
  });
  
  if (error) {
    console.error(`Error checking if ${tableName} table exists:`, error);
    return false;
  }
  
  return !!data;
};

/**
 * Get count from a Supabase table using the REST API
 */
export const getTableCount = async (tableName: string): Promise<number> => {
  try {
    const countQuery = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${tableName}?select=count`,
      {
        method: 'HEAD',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    );
    
    return parseInt(countQuery.headers.get('content-range')?.split('/')[1] || '0');
  } catch (error) {
    console.error(`Error getting count for ${tableName}:`, error);
    return 0;
  }
};

/**
 * Get the last sync date from the sync log
 */
export const getLastSyncDate = async (): Promise<Date | null> => {
  try {
    const syncLogTableExists = await checkTableExists('rxnorm_sync_log');
    
    if (!syncLogTableExists) {
      console.warn('rxnorm_sync_log table does not exist');
      return null;
    }
    
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
    return syncLogData.length > 0 ? new Date(syncLogData[0].sync_date) : null;
  } catch (error) {
    console.error('Error getting last sync date:', error);
    return null;
  }
};

/**
 * Fetch all database statistics
 */
export const fetchDatabaseStats = async (language: Languages): Promise<DatabaseStats | null> => {
  try {
    // Check connection first
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
      return null;
    }
    
    // Check if rxnorm_items table exists
    const rxnormItemsExists = await checkTableExists('rxnorm_items');
    
    if (!rxnormItemsExists) {
      toast({
        title: language === 'pt' 
          ? 'Erro ao verificar tabelas de RxNorm' 
          : 'Error checking RxNorm tables',
        variant: 'error'
      });
      return null;
    }

    // Fetch counts for each table
    const medCount = await getTableCount('rxnorm_items');
    
    // Check other tables and get their counts
    const mappingsTableExists = await checkTableExists('rxnorm_anvisa_mappings');
    const mappingCount = mappingsTableExists ? await getTableCount('rxnorm_anvisa_mappings') : 0;
    
    const cacheTableExists = await checkTableExists('rxnorm_search_cache');
    const cacheCount = cacheTableExists ? await getTableCount('rxnorm_search_cache') : 0;
    
    // Get last sync date
    const lastSyncDate = await getLastSyncDate();
    
    return {
      totalMedications: medCount,
      totalMappings: mappingCount,
      totalCacheEntries: cacheCount,
      lastSyncDate
    };
  } catch (error) {
    console.error('Error fetching RxNorm database stats:', error);
    return null;
  }
};

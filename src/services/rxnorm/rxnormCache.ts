
import { supabase } from '@/integrations/supabase/client';

/**
 * Clear expired cache entries with configurable retention period
 */
export const clearExpiredCache = async (retentionDays = 7): Promise<{
  success: boolean;
  details: {
    tableName: string;
    rowsDeleted: number;
  }[];
}> => {
  try {
    const { data, error } = await supabase
      .rpc('clean_rxnorm_cache', { retention_days: retentionDays });
      
    if (error) {
      console.error('Error clearing expired cache:', error);
      return { 
        success: false,
        details: []
      };
    }
    
    // Transform the data to match our frontend expectations
    const details = data.map((item: any) => ({
      tableName: item.table_name,
      rowsDeleted: item.rows_deleted
    }));
    
    return {
      success: true,
      details
    };
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return {
      success: false,
      details: []
    };
  }
};

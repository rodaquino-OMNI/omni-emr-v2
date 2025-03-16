
import { supabase } from '@/integrations/supabase/client';

/**
 * List of materialized views that should be refreshed periodically
 */
const MATERIALIZED_VIEWS = [
  'patient_latest_vitals',
  'patient_status_view'
];

/**
 * Refresh all materialized views
 * @returns Promise<boolean> true if all views were refreshed successfully, false otherwise
 */
export const refreshAllMaterializedViews = async (): Promise<boolean> => {
  try {
    // Check if we can connect to the database
    const { data: connected, error: connError } = await supabase.rpc('check_connection');
    
    if (connError || !connected) {
      console.error('Database connection error:', connError);
      return false;
    }
    
    // Refresh each materialized view
    for (const view of MATERIALIZED_VIEWS) {
      try {
        await supabase.rpc('refresh_materialized_view', { view_name: view });
        console.log(`Refreshed materialized view: ${view}`);
      } catch (refreshError) {
        // This likely means the view doesn't exist yet, which is acceptable
        console.warn(`Could not refresh materialized view ${view}:`, refreshError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error refreshing materialized views:', error);
    return false;
  }
};

/**
 * Apply data retention policies to clean up old data
 * @returns Promise<{ table: string, rowsDeleted: number }[]> Results of data retention policy application
 */
export const applyDataRetentionPolicies = async (): Promise<{ table: string, rowsDeleted: number }[]> => {
  try {
    const { data, error } = await supabase.rpc('apply_data_retention_policies');
    
    if (error) {
      console.error('Error applying data retention policies:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error applying data retention policies:', error);
    return [];
  }
};

/**
 * Clean up RxNorm cache tables to prevent excessive growth
 * @param retentionDays Number of days to retain cache entries (default: 7)
 * @returns Promise<{ table: string, rowsDeleted: number }[]> Results of cache cleanup
 */
export const cleanRxNormCache = async (retentionDays = 7): Promise<{ table: string, rowsDeleted: number }[]> => {
  try {
    const { data, error } = await supabase.rpc('clean_rxnorm_cache', { retention_days: retentionDays });
    
    if (error) {
      console.error('Error cleaning RxNorm cache:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error cleaning RxNorm cache:', error);
    return false;
  }
};
